import React, { useState, useMemo, useEffect } from "react"; // Added useEffect
import {
  FiClock,
  FiPlus,
  FiEdit,
  FiCalendar,
  FiFilter,
  FiUser,
  FiPieChart,
  FiDownload,
  FiPrinter,
  FiAlertCircle,
  FiTrash2, // Ensure FiTrash2 is imported
} from "react-icons/fi";
import AddEntityModal from "../AddEntity/AddEntityModal";

import type { Project, TimeEntry, Deliverable } from "../../types";
import { useNavigate } from "react-router-dom";
import apiClient from "../../apis/apiClient";

interface ProjectTimesheetViewProps {
  project: {
    _id: string;
    name: string;
  };
  timeEntries: TimeEntry[];
  deliverables?: Deliverable[];
  projects: Project[];
  onAddDeliverable: (data: Deliverable) => void;
  onEditTime?: (entry: TimeEntry) => void;
  onDeleteTime?: (projectId: string, timeEntryId: string) => void;
}

const ProjectTimesheetView: React.FC<ProjectTimesheetViewProps> = ({
  project,
  timeEntries,
  deliverables = [],
  projects,
  onAddDeliverable,
  onEditTime = () => console.warn("onEditTime handler not provided"),
  onDeleteTime = () => console.warn("onDeleteTime handler not provided"),
}) => {
  const navigate = useNavigate();
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [editingDeliverable, setEditingDeliverable] =
    useState<Deliverable | null>(null);
  const [deliverableToDelete, setDeliverableToDelete] = useState<string | null>(
    null
  );
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [activeTab, setActiveTab] = useState("timesheet");
  const [userNameById, setUserNameById] = useState<Record<string, string>>({});

  const [localDeliverables, setLocalDeliverables] = useState(deliverables);
  useEffect(() => {
    setLocalDeliverables(deliverables);
  }, [deliverables]);

  // Fetch and cache user names for any user/employee ids present in entries
  useEffect(() => {
    const ids = new Set<string>();
    timeEntries.forEach((entry) => {
      const candidate = (entry as any).user ?? (entry as any).employee;
      if (typeof candidate === "string") {
        ids.add(candidate);
      }
    });
    const idsToFetch = Array.from(ids).filter((id) => !userNameById[id]);
    if (idsToFetch.length === 0) return;

    let isCancelled = false;
    (async () => {
      const updates: Record<string, string> = {};
      await Promise.all(
        idsToFetch.map(async (id) => {
          try {
            const resp = await apiClient.get(`/api/users/${id}`);
            const data = resp?.data;
            const name =
              data?.name ||
              (data?.firstName || "") + (data?.lastName ? ` ${data.lastName}` : "");
            if (name && !isCancelled) {
              updates[id] = name;
            }
          } catch {
            // ignore missing users
          }
        })
      );
      if (!isCancelled && Object.keys(updates).length > 0) {
        setUserNameById((prev) => ({ ...prev, ...updates }));
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [timeEntries, userNameById]);

  // ✅ Helper to resolve user name from user object or id
  const resolveUserName = (entry: TimeEntry): string | null => {
    // Prefer populated 'user' but also support APIs that use 'employee'
    const userLike = (entry as any).user ?? (entry as any).employee;
    if (!userLike) return null;

    // If it's an object, try common name fields
    if (typeof userLike === "object") {
      if (userLike.name) return userLike.name;
      if (userLike.fullName) return userLike.fullName;
      if (userLike.firstName || userLike.lastName)
        return `${userLike.firstName || ""} ${userLike.lastName || ""}`.trim() || null;
      if (userLike.profile?.name) return userLike.profile.name;
      return null;
    }

    // If it's an id string, try to find another entry where the same id is populated
    if (typeof userLike === "string") {
      // First check cache fetched from backend
      if (userNameById[userLike]) return userNameById[userLike];

      const match = timeEntries.find((e) => {
        const u = (e as any).user ?? (e as any).employee;
        return (
          typeof u === "object" &&
          (u._id === userLike ||
            u.id === userLike ||
            u._id?.toString() === userLike ||
            u.id?.toString() === userLike)
        );
      });
      if (match) {
        const mUser = (match as any).user ?? (match as any).employee;
        if (mUser?.name) return mUser.name;
        if (mUser?.fullName) return mUser.fullName;
        if (mUser?.firstName || mUser?.lastName)
          return `${mUser.firstName || ""} ${mUser.lastName || ""}`.trim() || null;
        if (mUser?.profile?.name) return mUser.profile.name;
      }
      return null;
    }
    return null;
  };

  // --- TEAM MEMBER NAMES ---
  const allTeamMemberNames = useMemo(() => {
    const employeeNames = new Set<string>();
    timeEntries.forEach((entry) => {
      const userName = resolveUserName(entry);
      if (userName) employeeNames.add(userName);
    });
    return Array.from(employeeNames);
  }, [timeEntries, userNameById]);

  const employees = useMemo(() => {
    return ["all", ...allTeamMemberNames];
  }, [allTeamMemberNames]);

  // --- FILTER ---
  const filteredTimeEntries = useMemo(() => {
    return timeEntries.filter((entry) => {
      const userName = resolveUserName(entry);
      if (selectedEmployee !== "all" && userName !== selectedEmployee) {
        return false;
      }
      if (
        dateRange.start &&
        entry.date &&
        new Date(entry.date) < new Date(dateRange.start)
      )
        return false;
      if (
        dateRange.end &&
        entry.date &&
        new Date(entry.date) > new Date(dateRange.end)
      )
        return false;
      return true;
    });
  }, [timeEntries, selectedEmployee, dateRange, userNameById]);

  // --- HOURS SUMMARY ---
  const hoursSummary = useMemo(() => {
    const summary: { [employee: string]: number } = {};
    let totalHours = 0;

    filteredTimeEntries.forEach((entry) => {
      const userName = resolveUserName(entry) || "Unknown User";
      if (userName && entry.hours != null) {
        summary[userName] = (summary[userName] || 0) + entry.hours;
        totalHours += entry.hours;
      }
    });

    return { summary, totalHours };
  }, [filteredTimeEntries, userNameById]);

  // Deliverable form config (unchanged)
  const deliverableConfig = {
    type: "deliverable",
    title: editingDeliverable ? "Edit Deliverable" : "Add Deliverable",
    fields: [
      { name: "date", label: "Delivery Date", type: "date", placeholder: "YYYY-MM-DD", required: true },
      { name: "description", label: "Description", type: "text", placeholder: "Enter deliverable description", required: true },
      { name: "notes", label: "Notes", type: "textarea", placeholder: "Enter additional notes", required: false },
      { name: "status", label: "Status", type: "select", required: true, options: ["pending", "delivered", "approved"] },
    ],
    onSubmit: (data: any) => {
      const deliverableData = {
        date: data.date,
        description: data.description,
        notes: data.notes || "",
        status: data.status || "pending",
        project: project._id,
      };
      onAddDeliverable(deliverableData as Deliverable);
      setShowDeliverableModal(false);
      setEditingDeliverable(null);
    },
    initialData: editingDeliverable || undefined,
  };

  const handleEditDeliverable = (deliverable: Deliverable) => {
    setEditingDeliverable(deliverable);
    setShowDeliverableModal(true);
  };
  const handleDeleteDeliverable = (id: string) => setDeliverableToDelete(id);
  const confirmDeleteDeliverable = () => {
    if (deliverableToDelete) {
      setLocalDeliverables((prev) =>
        prev.filter((d) => d._id !== deliverableToDelete)
      );
      setDeliverableToDelete(null);
    }
  };
  const cancelDeleteDeliverable = () => setDeliverableToDelete(null);

  const getStatusBadgeClass = (status: string | undefined) => {
    switch (status) {
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800";
      case "in-progress":
      case "delivered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiClock className="text-blue-600" /> Timesheet for {project.name}
        </h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50">
            <FiDownload size={16} /> Export
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50">
            <FiPrinter size={16} /> Print
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {["timesheet", "deliverables", "analytics"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiFilter /> Filters
          </h2>
          <button
            onClick={() => {
              setDateRange({ start: "", end: "" });
              setSelectedEmployee("all");
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date & Employee Filters */}
          {["start", "end"].map((type) => (
            <div key={type}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type === "start" ? "Start Date" : "End Date"}
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dateRange[type]}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, [type]: e.target.value })
                  }
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {employees.map((employeeName) => (
                  <option key={employeeName} value={employeeName}>
                    {employeeName === "all" ? "All Employees" : employeeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Timesheet */}
      {activeTab === "timesheet" && (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task / Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTimeEntries.length > 0 ? (
                  filteredTimeEntries.map((entry) => {
                    const entryId = entry._id || entry.id;
                    const userName = resolveUserName(entry) || "Unknown User";
                    return (
                      <tr key={entryId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(entry.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.title || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.hours != null ? `${entry.hours}h` : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {entry.note || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              entry.approved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {entry.approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-3">
                          <button
                            onClick={() => onEditTime(entry)}
                            className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                            disabled={!entryId}
                            title="Edit Time Entry"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => {
                              if (project._id && entryId) {
                                onDeleteTime(project._id, entryId);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            disabled={!project._id || !entryId}
                            title="Delete Time Entry"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No time entries found for this period or employee.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Hours Summary */}
          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Hours Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(hoursSummary.summary).map(([employeeName, hours]) => (
                <div
                  key={employeeName}
                  className="bg-gray-50 p-4 rounded-lg flex justify-between items-center text-sm"
                >
                  <span className="font-medium text-gray-700">{employeeName}</span>
                  <span className="text-gray-900">{hours} hours</span>
                </div>
              ))}
              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center text-sm col-span-1 md:col-span-2">
                <span className="font-semibold text-blue-800">Total Hours</span>
                <span className="font-semibold text-blue-900">
                  {hoursSummary.totalHours} hours
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deliverables */}
      {activeTab === "deliverables" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Deliverables</h2>
            <button
              onClick={() => {
                setEditingDeliverable(null);
                setShowDeliverableModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <FiPlus size={16} /> Add Deliverable
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text
-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Status
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Notes
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Actions
                   </th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {localDeliverables.length > 0 ? (
                   localDeliverables.map((deliverable) => (
                     <tr
                       key={deliverable._id || deliverable.id} // Use _id or id
                       className="hover:bg-gray-50"
                     >
                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                         {formatDate(deliverable.date)}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-gray-900">{deliverable.description}</td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span
                           className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass( // Added inline-flex
                             deliverable.status
                           )}`}
                         >
                           {/* Capitalize status */}
                           {deliverable.status ? deliverable.status.charAt(0).toUpperCase() + deliverable.status.slice(1) : 'N/A'}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-gray-500 max-w-xs truncate"> {/* Added max-w truncate */}
                         {deliverable.notes || "-"}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-3"> {/* Use flex */}
                         <button
                           onClick={() => handleEditDeliverable(deliverable)}
                           className="text-indigo-600 hover:text-indigo-800"
                           title="Edit Deliverable" // Add title
                         >
                           <FiEdit size={16} />
                         </button>
                         <button
                           onClick={() => handleDeleteDeliverable(deliverable._id || deliverable.id || '')} // Handle potential missing id
                           className="text-red-600 hover:text-red-800"
                           title="Delete Deliverable" // Add title
                         >
                           <FiTrash2 size={16} />
                         </button>
                       </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td
                       colSpan={5}
                       className="px-6 py-4 text-center text-gray-500"
                     >
                       No deliverables found for this project.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}


      {activeTab === "analytics" && (
        <div>
          {/* ... Analytics Placeholder ... */}
           <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
             <FiPieChart /> Analytics
           </h2>
           <p className="text-gray-600 mt-4">
             Analytics for {project.name} will be displayed here (e.g., charts,
             graphs).
           </p>
        </div>
      )}

      {/* Deliverable Modal */}
      {showDeliverableModal && (
        <AddEntityModal
          config={deliverableConfig as any} // Cast config type if needed by AddEntityModal
          onClose={() => {
            setShowDeliverableModal(false);
            setEditingDeliverable(null);
          }}
        />
      )}
      {/* Delete Confirmation Modal */}
      {/* ... (Delete confirmation modal code is fine) ... */}
       {deliverableToDelete && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> {/* Added padding */}
           <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"> {/* Added shadow */}
             <h2 className="text-lg font-semibold text-gray-800 mb-4">
               Confirm Delete
             </h2>
             <p className="text-gray-600 mb-6 text-sm"> {/* Adjusted text size */}
               Are you sure you want to delete this deliverable? This action cannot be undone.
             </p>
             <div className="flex justify-end gap-3"> {/* Adjusted gap */}
               <button
                 onClick={cancelDeleteDeliverable}
                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm font-medium" // Adjusted styles
               >
                Cancel
               </button>
               <button
                 onClick={confirmDeleteDeliverable}
                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium" // Adjusted styles
               >
                Delete
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};
export default ProjectTimesheetView;