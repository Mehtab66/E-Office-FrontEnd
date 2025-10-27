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

interface ProjectTimesheetViewProps {
  project: {
    _id: string;
    name: string;
  };
  timeEntries: TimeEntry[];
  deliverables?: Deliverable[];
  projects: Project[]; // <-- 1. ADD projects PROP HERE
  onAddDeliverable: (data: Deliverable) => void;
  // --- ADDED props for Edit/Delete ---
  onEditTime?: (entry: TimeEntry) => void; // Optional: Add if needed
  onDeleteTime?: (projectId: string, timeEntryId: string) => void; // Optional: Add if needed
}

// ... (rest of the interface, no changes needed) ...

const ProjectTimesheetView: React.FC<ProjectTimesheetViewProps> = ({
  project,
  timeEntries,
  deliverables = [],
  projects, // <-- 2. DESTRUCTURE projects PROP HERE
  onAddDeliverable,
  // --- ADDED props for Edit/Delete ---
  onEditTime = () => console.warn("onEditTime handler not provided"), // Default handler
  onDeleteTime = () => console.warn("onDeleteTime handler not provided"), // Default handler
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

  // --- ADDED: Manage local state for deliverables if needed ---
  // If deliverables are fully managed by the parent, you might not need this local state
  const [localDeliverables, setLocalDeliverables] = useState(deliverables);
  useEffect(() => {
    setLocalDeliverables(deliverables);
  }, [deliverables]);
  // --------------------------------------------------------

  // Check if project is valid
  if (!project || !project._id || !project.name) {
    // ... (error handling code, no changes needed) ...
  }

  // Get all unique employee names from time entries
  const allTeamMemberNames = useMemo(() => {
    const employeeNames = new Set<string>();
    timeEntries.forEach((entry) => {
      // Safely access user name
      const userName = typeof entry.user === 'object' ? entry.user?.name : entry.user;
      if (userName) {
        employeeNames.add(userName);
      }
    });
    return Array.from(employeeNames);
  }, [timeEntries]);


  // Get unique employees for filter dropdown
  const employees = useMemo(() => {
    return ["all", ...allTeamMemberNames];
  }, [allTeamMemberNames]);


  // Filter time entries based on filters
  const filteredTimeEntries = useMemo(() => {
    return timeEntries
      // No need to filter by project._id here if parent already does it
      // .filter((entry) => entry.project === project._id)
      .filter((entry) => {
        // --- FIX: Filter by user name ---
        const userName = typeof entry.user === 'object' ? entry.user?.name : entry.user;
        if (selectedEmployee !== "all" && userName !== selectedEmployee) {
          return false;
        }
        // --- END FIX ---
        if (
          dateRange.start &&
          entry.date && // Check if date exists
          new Date(entry.date) < new Date(dateRange.start)
        ) {
          return false;
        }
        if (
            dateRange.end &&
            entry.date && // Check if date exists
            new Date(entry.date) > new Date(dateRange.end)
           ) {
          return false;
        }
        return true;
      });
  }, [timeEntries, /* project._id, */ selectedEmployee, dateRange]);

  // Calculate total hours per employee and project
  const hoursSummary = useMemo(() => {
    const summary: { [employee: string]: number } = {};
    let totalHours = 0;

    filteredTimeEntries.forEach((entry) => {
       // --- FIX: Use user name for summary key ---
       const userName = typeof entry.user === 'object' ? entry.user?.name : entry.user;
       if (userName && entry.hours != null) { // Check hours is not null/undefined
         summary[userName] = (summary[userName] || 0) + entry.hours;
         totalHours += entry.hours;
       }
       // --- END FIX ---
    });

    return { summary, totalHours };
  }, [filteredTimeEntries]);


  // Deliverable form configuration
  const deliverableConfig: DeliverableFormConfig = {
    type: "deliverable",
    title: editingDeliverable ? "Edit Deliverable" : "Add Deliverable",
    fields: [
      // ... (fields are okay, no changes needed) ...
       {
         name: "date",
         label: "Delivery Date",
         type: "date",
         placeholder: "YYYY-MM-DD",
         required: true,
       },
       {
         name: "description",
         label: "Description",
         type: "text",
         placeholder: "Enter deliverable description",
         required: true,
       },
       {
         name: "notes",
         label: "Notes",
         type: "textarea",
         placeholder: "Enter additional notes",
         required: false,
       },
       {
         name: "status",
         label: "Status",
         type: "select",
         required: true,
         // Make sure these match your backend enum/validation
         options: ["pending", "delivered", "approved"],
       },
    ],
    onSubmit: (data) => {
       // --- ADJUSTED: Call parent handler instead of local state ---
       const deliverableData = {
         // Generate ID only if creating locally, backend should handle IDs
         // _id: editingDeliverable ? editingDeliverable._id : Date.now().toString(),
         date: data.date,
         description: data.description,
         notes: data.notes || "",
         status: data.status || "pending",
         project: project._id, // Add project ID
         // createdBy: You might need to pass the current user ID here or handle it in the parent/backend
       };

       console.log("Submitting deliverable:", deliverableData);
       // Call the parent's handler (which should trigger a mutation)
       onAddDeliverable(deliverableData as Deliverable);
       // Remove local state updates if parent manages data via queries
       /*
       if (editingDeliverable) {
         setLocalDeliverables((prev) =>
           prev.map((d) => (d._id === editingDeliverable._id ? { ...d, ...deliverableData } : d))
         );
       } else {
         // Assuming backend adds and returns the new deliverable via query refetch
         // setLocalDeliverables((prev) => [...prev, deliverableData as Deliverable]);
         onAddDeliverable(deliverableData as Deliverable); // Call parent handler
       }
       */
       // --- END ADJUSTMENT ---

      setShowDeliverableModal(false);
      setEditingDeliverable(null);
    },
    initialData: editingDeliverable || undefined,
  };


  // Handle edit deliverable
  const handleEditDeliverable = (deliverable: Deliverable) => {
    setEditingDeliverable(deliverable);
    setShowDeliverableModal(true);
  };

  // Handle delete deliverable with confirmation
  const handleDeleteDeliverable = (id: string) => {
    setDeliverableToDelete(id);
  };

  // Confirm delete deliverable
  const confirmDeleteDeliverable = () => {
    if (deliverableToDelete) {
      // TODO: Call a delete mutation here instead of modifying local state directly
      console.warn("Delete deliverable mutation not implemented yet.");
      setLocalDeliverables((prev) =>
         prev.filter((d) => d._id !== deliverableToDelete)
       );
      setDeliverableToDelete(null);
    }
  };


  // Cancel delete deliverable
  const cancelDeleteDeliverable = () => {
    setDeliverableToDelete(null);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string | undefined) => { // Allow undefined
    switch (status) {
      case "completed":
      case "approved": // Added approved
        return "bg-green-100 text-green-800";
      case "in-progress":
      case "delivered": // Added delivered
        return "bg-blue-100 text-blue-800";
      default: // pending or undefined
        return "bg-yellow-100 text-yellow-800";
    }
  };


  // Format date safely
  const formatDate = (dateString: string | Date | undefined) => {
     if (!dateString) return "N/A";
     try {
       return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
       });
     } catch (e) {
       return "Invalid Date";
     }
  };


  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      {/* ... (Header code is fine) ... */}
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
      {/* ... (Tabs code is fine) ... */}
       <div className="flex border-b border-gray-200 mb-6">
         <button
           className={`px-4 py-2 font-medium ${
             activeTab === "timesheet"
               ? "text-blue-600 border-b-2 border-blue-600"
               : "text-gray-500 hover:text-gray-700"
           }`}
           onClick={() => setActiveTab("timesheet")}
         >
           Timesheet
         </button>
         <button
           className={`px-4 py-2 font-medium ${
             activeTab === "deliverables"
               ? "text-blue-600 border-b-2 border-blue-600"
               : "text-gray-500 hover:text-gray-700"
           }`}
           onClick={() => setActiveTab("deliverables")}
         >
           Deliverables
         </button>
         <button
           className={`px-4 py-2 font-medium ${
             activeTab === "analytics"
               ? "text-blue-600 border-b-2 border-blue-600"
               : "text-gray-500 hover:text-gray-700"
           }`}
           onClick={() => setActiveTab("analytics")}
         >
           Analytics
         </button>
       </div>


      {/* Filters */}
      {/* ... (Filters code is fine, including employee dropdown using 'employees') ... */}
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
           {/* Date Range Filter */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Start Date
             </label>
             <div className="relative">
               <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
               <input
                 type="date"
                 value={dateRange.start}
                 onChange={(e) =>
                   setDateRange({ ...dateRange, start: e.target.value })
                 }
                 className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Start Date"
               />
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               End Date
             </label>
             <div className="relative">
               <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
               <input
                 type="date"
                 value={dateRange.end}
                 onChange={(e) =>
                   setDateRange({ ...dateRange, end: e.target.value })
                 }
                 className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="End Date"
               />
             </div>
           </div>
           {/* Employee Filter */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Employee
             </label>
             <div className="relative">
               <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
               <select
                 value={selectedEmployee}
                 onChange={(e) => setSelectedEmployee(e.target.value)}
                 className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500" // Added appearance-none for better styling control
               >
                 {/* Ensure 'employees' array is correctly populated */}
                 {employees.map((employeeName) => (
                   <option key={employeeName} value={employeeName}>
                     {employeeName === "all" ? "All Employees" : employeeName}
                   </option>
                 ))}
               </select>
               {/* Add dropdown arrow indicator */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
             </div>
           </div>
         </div>
       </div>


      {/* Content based on active tab */}
      {activeTab === "timesheet" && (
        <div>
          <div className="overflow-x-auto">
             {/* --- Timesheet Table --- */}
             <table className="min-w-full divide-y divide-gray-200"> {/* Added min-w-full */}
                <thead className="bg-gray-50">
                   <tr>
                      {/* --- ADDED Employee Column Header --- */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Employee
                      </th>
                      {/* ------------------------------------ */}
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
                         const entryId = entry._id || entry.id; // Use _id or id
                         // --- Safely get user name ---
                         const userName = typeof entry.user === 'object' ? entry.user?.name : entry.user;
                         // ---------------------------
                         return (
                            <tr key={entryId} className="hover:bg-gray-50">
                               {/* --- ADDED Employee Data Cell --- */}
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {userName || 'N/A'}
                               </td>
                               {/* ------------------------------- */}
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(entry.date)}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.title || 'N/A'}</td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {entry.hours != null ? `${entry.hours}h` : 'N/A'}
                               </td>
                               <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate"> {/* Added max-w truncate */}
                                  {entry.note || "-"}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                     className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ // Added inline-flex
                                     entry.approved
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                     }`}
                                  >
                                     {entry.approved ? "Approved" : "Pending"}
                                  </span>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-3"> {/* Use flex for actions */}
                                  <button
                                     onClick={() => onEditTime(entry)}
                                     className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                     disabled={!entryId} // Disable if no ID
                                     title="Edit Time Entry" // Add title
                                  >
                                     <FiEdit />
                                  </button>
                                  <button
                                     onClick={() => {
                                        if (project._id && entryId) {
                                           onDeleteTime(project._id, entryId);
                                        } else {
                                           console.error("Missing project or entry ID for delete");
                                        }
                                     }}
                                     className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                     disabled={!project._id || !entryId} // Disable if IDs missing
                                     title="Delete Time Entry" // Add title
                                  >
                                     <FiTrash2 />
                                  </button>
                               </td>
                            </tr>
                         );
                      })
                   ) : (
                     <tr>
                       <td colSpan={7} className="px-6 py-4 text-center text-gray-500"> {/* Adjusted colSpan */}
                         No time entries found for this period or employee.
                       </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>

          {/* Hours Summary */}
          {/* ... (Hours Summary code is mostly fine, uses user name now) ... */}
           <div className="mt-6 border-t pt-6"> {/* Added border-t pt-6 */}
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
               <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center text-sm col-span-1 md:col-span-2"> {/* Made total span full width on small screens */}
                 <span className="font-semibold text-blue-800">Total Hours</span>
                 <span className="font-semibold text-blue-900">
                   {hoursSummary.totalHours} hours
                 </span>
               </div>
             </div>
           </div>
        </div>
      )}


      {activeTab === "deliverables" && (
        <div>
           {/* ... Deliverables Table ... */}
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold text-gray-800">
               Deliverables
             </h2>
             <button
               onClick={() => {
                 setEditingDeliverable(null);
                 setShowDeliverableModal(true);
               }}
               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm" // Adjusted size
             >
               <FiPlus size={16} /> Add Deliverable
             </button>
           </div>
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200 text-sm"> {/* Added min-w-full and text-sm */}
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Date
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Description
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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