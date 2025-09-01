import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiClock,
  FiPlus,
  FiEdit,
  FiX,
  FiCalendar,
  FiFilter,
  FiUser,
  FiPieChart,
  FiDownload,
  FiPrinter,
  FiAlertCircle,
} from "react-icons/fi";
import AddEntityModal from "../AddEntity/AddEntityModal";

interface TimeEntry {
  id: string;
  employee: string;
  project: string;
  date: string;
  hours: number;
  description: string;
  task: string;
}

interface Deliverable {
  id: string;
  date: string;
  description: string;
  notes: string;
  status: "pending" | "in-progress" | "completed";
}

interface ProjectTimesheetViewProps {
  project: {
    id: string;
    name: string;
  } | null;
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
}

const ProjectTimesheetView: React.FC<ProjectTimesheetViewProps> = ({
  project,
  timeEntries,
  onAddDeliverable,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project: stateProject, timeEntries: stateTimeEntries } =
    location.state || {};

  // Use state values if available, fallback to props
  const finalProject = stateProject || project;
  const finalTimeEntries = stateTimeEntries || timeEntries;

  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    {
      id: "1",
      date: "2023-07-15",
      description: "Finalize UI Design",
      notes: "All screens approved by client",
      status: "completed",
    },
    {
      id: "2",
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

  // Filter states
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [activeTab, setActiveTab] = useState("timesheet");

  // Check if project is valid
  if (!finalProject || !finalProject.id || !finalProject.name) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800">
          Error: Invalid project data
        </h1>
        <p className="text-gray-600">
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

  // Get all team members (not just filtered ones)
  const allTeamMembers = useMemo(() => {
    const employeeSet = new Set(
      finalTimeEntries
        .filter(
          (entry: { project: any }) => entry.project === finalProject.name
        )
        .map((entry: { employee: any }) => entry.employee)
    );
    return Array.from(employeeSet);
  }, [finalTimeEntries, finalProject.name]);

  // Get unique employees for filter
  const employees = useMemo(() => {
    return ["all", ...allTeamMembers];
  }, [allTeamMembers]);

  // Filter time entries based on filters
  const filteredTimeEntries = useMemo(() => {
    return finalTimeEntries
      .filter((entry: { project: any }) => entry.project === finalProject.name)
      .filter((entry: { employee: string; date: string | number | Date }) => {
        // Employee filter
        if (selectedEmployee !== "all" && entry.employee !== selectedEmployee) {
          return false;
        }

        // Date range filter
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
  }, [finalTimeEntries, finalProject.name, selectedEmployee, dateRange]);

  // Calculate total hours per employee and project
  const hoursSummary = useMemo(() => {
    const summary: { [employee: string]: number } = {};
    let totalHours = 0;

    filteredTimeEntries.forEach(
      (entry: { employee: string | number; hours: number }) => {
        summary[entry.employee] = (summary[entry.employee] || 0) + entry.hours;
        totalHours += entry.hours;
      }
    );

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
        id: editingDeliverable
          ? editingDeliverable.id
          : (deliverables.length + 1).toString(),
        date: data.date,
        description: data.description,
        notes: data.notes || "",
        status: data.status || "pending",
      };

      if (editingDeliverable) {
        setDeliverables((prev) =>
          prev.map((d) => (d.id === deliverable.id ? deliverable : d))
        );
      } else {
        setDeliverables((prev) => [...prev, deliverable]);
        onAddDeliverable(deliverable);
      }

      setShowDeliverableModal(false);
      setEditingDeliverable(null);
    },
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
        prev.filter((d) => d.id !== deliverableToDelete)
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
          <FiClock className="text-blue-600" /> Timesheet for{" "}
          {finalProject.name}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
              <FiUser
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm"
              >
                {employees.map((employee) => (
                  <option key={String(employee)} value={String(employee)}>
                    {employee === "all" ? "All Employees" : String(employee)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-blue-800">Total Hours</h3>
            <FiClock className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            {hoursSummary.totalHours.toFixed(2)}
          </p>
          <p className="text-xs text-blue-700 mt-1">across all employees</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-green-800">Team Members</h3>
            <FiUser className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {allTeamMembers.length}
          </p>
          <p className="text-xs text-green-700 mt-1">working on this project</p>
        </div>
      </div>

      {/* Timesheet Table */}
      {activeTab === "timesheet" && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Time Entries
            </h2>
            <p className="text-sm text-gray-600">
              Showing {filteredTimeEntries.length} of{" "}
              {
                finalTimeEntries.filter(
                  (entry: { project: any }) =>
                    entry.project === finalProject.name
                ).length
              }{" "}
              entries
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-sm">
                    Employee
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-sm">
                    Date
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-sm">
                    Task Title
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-sm">
                    Hours
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-sm">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTimeEntries.length > 0 ? (
                  filteredTimeEntries.map(
                    (entry: {
                      id: React.Key | null | undefined;
                      employee: string;
                      date: string;
                      task: string;
                      hours: number;
                      description: string;
                    }) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium mr-2">
                              {entry.employee
                                ? String(entry.employee).charAt(0)
                                : ""}
                            </div>
                            {entry.employee}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatDate(entry.date)}
                        </td>
                        <td className="px-4 py-3 font-medium">{entry.task}</td>
                        <td className="px-4 py-3 font-medium">
                          {entry.hours.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {entry.description}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No time entries match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deliverables Section */}
      {activeTab === "deliverables" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Deliverables
            </h2>
            <button
              onClick={() => setShowDeliverableModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FiPlus size={16} /> Add Deliverable
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliverables.length > 0 ? (
              deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                        deliverable.status
                      )}`}
                    >
                      {deliverable.status.replace("-", " ")}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditDeliverable(deliverable)}
                        className="text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteDeliverable(deliverable.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-1">
                    {deliverable.description}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {deliverable.notes}
                  </p>

                  <div className="flex items-center text-xs text-gray-500">
                    <FiCalendar className="mr-1" size={12} />
                    Due: {formatDate(deliverable.date)}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No deliverables added yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {activeTab === "analytics" && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Project Analytics
          </h2>

          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Hours by Employee */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FiUser className="text-blue-600" /> Hours by Employee
              </h3>

              <div className="space-y-3">
                {Object.entries(hoursSummary.summary)
                  .sort((a, b) => b[1] - a[1])
                  .map(([employee, hours]) => (
                    <div key={employee}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{employee}</span>
                        <span className="text-gray-900 font-medium">
                          {hours.toFixed(2)} hours
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (hours / hoursSummary.totalHours) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Project Hours Overview */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FiPieChart className="text-purple-600" /> Project Hours Overview
            </h3>

            <div className="flex items-center justify-center h-64">
              <div
                className="relative"
                style={{ width: "250px", height: "250px" }}
              >
                {/* This would be replaced with an actual chart library in production */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {hoursSummary.totalHours.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total Hours</div>
                  </div>
                </div>

                {/* Simulated pie chart segments */}
                {Object.entries(hoursSummary.summary).map(
                  ([employee, hours], index) => {
                    const percentage = (hours / hoursSummary.totalHours) * 100;
                    const rotation = Object.entries(hoursSummary.summary)
                      .slice(0, index)
                      .reduce(
                        (acc, [, h]) =>
                          acc + (h / hoursSummary.totalHours) * 360,
                        0
                      );

                    return (
                      <div
                        key={employee}
                        className="absolute inset-0"
                        style={{
                          clipPath: `conic-gradient(from ${rotation}deg, transparent ${percentage}%, #0000 0)`,
                        }}
                      >
                        <div
                          className="w-full h-full rounded-full"
                          style={{
                            background: `conic-gradient(
                            from ${rotation}deg,
                            #4f46e5 0deg ${percentage}deg,
                            #e5e7eb ${percentage}deg 360deg
                          )`,
                          }}
                        ></div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(hoursSummary.summary).map(([employee, hours]) => (
                <div key={employee} className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-700 truncate">
                    {employee}
                  </span>
                  <span className="text-sm font-medium ml-1">
                    ({hours.toFixed(1)}h)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deliverableToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FiAlertCircle className="text-red-600 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this deliverable? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDeleteDeliverable}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDeliverable}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deliverable Modal */}
      {showDeliverableModal && (
        <AddEntityModal
          config={deliverableConfig}
          initialData={editingDeliverable || undefined}
          onClose={() => {
            setShowDeliverableModal(false);
            setEditingDeliverable(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectTimesheetView;
