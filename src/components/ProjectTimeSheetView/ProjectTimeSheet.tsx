import React, { useState, useMemo } from "react";
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
  FiTrash2,
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
  onAddDeliverable: (data: Deliverable) => void;
}

interface DeliverableFormConfig {
  type: "deliverable";
  title: string;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }[];
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ProjectTimesheetView: React.FC<ProjectTimesheetViewProps> = ({
  project,
  timeEntries,
  onAddDeliverable,
}) => {
  const navigate = useNavigate();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    {
      _id: "1",
      date: "2023-07-15",
      description: "Finalize UI Design",
      notes: "All screens approved by client",
      status: "completed",
    },
    {
      _id: "2",
      date: "2023-07-22",
      description: "API Integration",
      notes: "Backend connected to frontend",
      status: "in-progress",
    },
  ]);
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [editingDeliverable, setEditingDeliverable] =
    useState<Deliverable | null>(null);
  const [deliverableToDelete, setDeliverableToDelete] = useState<string | null>(
    null
  );
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [activeTab, setActiveTab] = useState("timesheet");

  // Check if project is valid
  if (!project || !project._id || !project.name) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiAlertCircle className="text-red-600" />
          Error: Invalid project data
        </h1>
        <p className="text-gray-600 mt-2">
          Please select a valid project to view its timesheet.
        </p>
        <button
          onClick={() => navigate("/manager")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Get all team members
  const allTeamMembers = useMemo(() => {
    const employeeSet = new Set(
      timeEntries
        .filter((entry) => entry.project === project._id)
        .map((entry) => entry.employee)
    );
    return Array.from(employeeSet);
  }, [timeEntries, project._id]);

  // Get unique employees for filter
  const employees = useMemo(() => {
    return ["all", ...allTeamMembers];
  }, [allTeamMembers]);

  // Filter time entries based on filters
  const filteredTimeEntries = useMemo(() => {
    return timeEntries
      .filter((entry) => entry.project === project._id)
      .filter((entry) => {
        if (selectedEmployee !== "all" && entry.employee !== selectedEmployee) {
          return false;
        }
        if (
          dateRange.start &&
          new Date(entry.date) < new Date(dateRange.start)
        ) {
          return false;
        }
        if (dateRange.end && new Date(entry.date) > new Date(dateRange.end)) {
          return false;
        }
        return true;
      });
  }, [timeEntries, project._id, selectedEmployee, dateRange]);

  // Calculate total hours per employee and project
  const hoursSummary = useMemo(() => {
    const summary: { [employee: string]: number } = {};
    let totalHours = 0;

    filteredTimeEntries.forEach((entry) => {
      summary[entry.employee] = (summary[entry.employee] || 0) + entry.hours;
      totalHours += entry.hours;
    });

    return { summary, totalHours };
  }, [filteredTimeEntries]);

  // Deliverable form configuration
  const deliverableConfig: DeliverableFormConfig = {
    type: "deliverable",
    title: editingDeliverable ? "Edit Deliverable" : "Add Deliverable",
    fields: [
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
        options: ["pending", "in-progress", "completed"],
      },
    ],
    onSubmit: (data) => {
      const deliverable: Deliverable = {
        _id: editingDeliverable
          ? editingDeliverable._id
          : (deliverables.length + 1).toString(),
        date: data.date,
        description: data.description,
        notes: data.notes || "",
        status: data.status || "pending",
      };

      if (editingDeliverable) {
        setDeliverables((prev) =>
          prev.map((d) => (d._id === deliverable._id ? deliverable : d))
        );
      } else {
        setDeliverables((prev) => [...prev, deliverable]);
        onAddDeliverable(deliverable);
      }

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
      setDeliverables((prev) =>
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
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
                className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {employees.map((employee) => (
                  <option key={employee} value={employee}>
                    {employee === "all" ? "All Employees" : employee}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "timesheet" && (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    Employee
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    Hours
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTimeEntries.length > 0 ? (
                  filteredTimeEntries.map((entry) => (
                    <tr
                      key={entry._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{entry.employee}</td>
                      <td className="px-4 py-3">{formatDate(entry.date)}</td>
                      <td className="px-4 py-3">{entry.hours}</td>
                      <td className="px-4 py-3">{entry.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-center text-gray-500"
                    >
                      No time entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Hours Summary */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Hours Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.entries(hoursSummary.summary).map(([employee, hours]) => (
                <div
                  key={employee}
                  className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                >
                  <span className="font-medium">{employee}</span>
                  <span>{hours} hours</span>
                </div>
              ))}
              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                <span className="font-semibold">Total Hours</span>
                <span className="font-semibold">
                  {hoursSummary.totalHours} hours
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deliverables" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Deliverables
            </h2>
            <button
              onClick={() => {
                setEditingDeliverable(null);
                setShowDeliverableModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FiPlus /> Add Deliverable
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    Description
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    Notes
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {deliverables.length > 0 ? (
                  deliverables.map((deliverable) => (
                    <tr
                      key={deliverable._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {formatDate(deliverable.date)}
                      </td>
                      <td className="px-4 py-3">{deliverable.description}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            deliverable.status
                          )}`}
                        >
                          {deliverable.status.charAt(0).toUpperCase() +
                            deliverable.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {deliverable.notes || "No notes"}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditDeliverable(deliverable)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteDeliverable(deliverable._id)
                          }
                          className="text-red-600 hover:text-red-800"
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
                      className="px-4 py-3 text-center text-gray-500"
                    >
                      No deliverables found
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
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiPieChart /> Analytics
          </h2>
          <p className="text-gray-600 mt-4">
            Analytics for {project.name} will be displayed here (e.g., charts,
            graphs).
          </p>
          {/* Placeholder for analytics */}
        </div>
      )}

      {/* Deliverable Modal */}
      {showDeliverableModal && (
        <AddEntityModal
          config={deliverableConfig}
          onClose={() => {
            setShowDeliverableModal(false);
            setEditingDeliverable(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deliverableToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this deliverable?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDeleteDeliverable}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDeliverable}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
