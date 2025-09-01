import React, { useState } from "react";
import {
  FiHome,
  FiBriefcase,
  FiClock,
  FiBell,
  FiSearch,
  FiPlus,
  FiChevronDown,
  FiMenu,
  FiX,
  FiUser,
  FiBarChart2,
  FiCalendar,
  FiPieChart,
  FiFilter,
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
} from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import "../../index.css";

// Type definitions (unchanged)
interface Project {
  id: string;
  name: string;
  client: string;
  status: "active" | "pending" | "completed";
  startDate: string;
  estimatedTime: string;
  teamLead: string;
  teamMembers: string[];
}

interface TimeEntry {
  id: string;
  employee: string;
  project: string;
  date: string;
  hours: number;
  task: string;
  notes: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  projects: string[];
}

interface AddTimeEntryModalProps {
  projects: Project[];
  employeeName: string;
  onSubmit: (data: TimeEntry) => void;
  onClose: () => void;
}

// Add Time Entry Modal Component with improved UI
const AddTimeEntryModal: React.FC<AddTimeEntryModalProps> = ({
  projects,
  employeeName,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    project: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    task: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: uuidv4(),
      employee: employeeName,
      project: formData.project,
      date: formData.date,
      hours: parseFloat(formData.hours),
      task: formData.task,
      notes: formData.notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add Time Entry</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-indigo-100 mt-1">
            Track your work hours and tasks
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours
              </label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                step="0.25"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              name="task"
              value={formData.task}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              rows={3}
              placeholder="Add details about the task..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Employee Dashboard Component with enhanced UI
const EmployeeDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState("week");

  // Sample employee data
  const employee: Employee = {
    id: "1",
    name: "Alex Turner",
    role: "Senior Developer",
    email: "alex@company.com",
    projects: ["Website Redesign", "Mobile App Development"],
  };

  // Sample projects data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      client: "TechCorp Inc.",
      status: "active",
      startDate: "2023-05-15",
      estimatedTime: "3 months",
      teamLead: "Sarah Johnson",
      teamMembers: ["Alex Turner", "Emily Chen", "Michael Rodriguez"],
    },
    {
      id: "2",
      name: "Mobile App Development",
      client: "Innovate Solutions",
      status: "active",
      startDate: "2023-06-10",
      estimatedTime: "5 months",
      teamLead: "Alex Turner",
      teamMembers: ["Alex Turner", "Lisa Wang", "James Wilson"],
    },
    {
      id: "3",
      name: "API Integration",
      client: "DataSystems Ltd",
      status: "pending",
      startDate: "2023-08-01",
      estimatedTime: "2 months",
      teamLead: "Michael Rodriguez",
      teamMembers: ["Alex Turner", "Sarah Johnson"],
    },
  ]);

  // Sample time entries
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: "1",
      employee: "Alex Turner",
      project: "Website Redesign",
      date: "2023-07-10",
      hours: 6.5,
      task: "Authentication",
      notes: "Implemented user authentication with JWT",
    },
    {
      id: "2",
      employee: "Emily Chen",
      project: "Website Redesign",
      date: "2023-07-10",
      hours: 7,
      task: "UI Design",
      notes: "Designed dashboard UI components",
    },
    {
      id: "3",
      employee: "Alex Turner",
      project: "Mobile App Development",
      date: "2023-07-11",
      hours: 5,
      task: "Login Screen",
      notes: "Developed login screen with biometric auth",
    },
    {
      id: "4",
      employee: "Alex Turner",
      project: "Website Redesign",
      date: "2023-07-12",
      hours: 7.5,
      task: "Database Schema",
      notes: "Designed and implemented new database schema",
    },
    {
      id: "5",
      employee: "Alex Turner",
      project: "Mobile App Development",
      date: "2023-07-13",
      hours: 4.5,
      task: "API Integration",
      notes: "Integrated with backend REST APIs",
    },
  ]);

  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "projects", label: "My Projects", icon: <FiBriefcase /> },
    { id: "timesheets", label: "Timesheets", icon: <FiClock /> },
  ];

  // Filter projects where employee is involved
  const employeeProjects = projects.filter(
    (project) =>
      project.teamMembers.includes(employee.name) ||
      project.teamLead === employee.name
  );

  // Calculate total hours for the selected period
  const totalHours = timeEntries
    .filter((entry) => entry.employee === employee.name)
    .reduce((total, entry) => total + entry.hours, 0);

  // Handle adding new time entry
  const handleAddTimeEntry = (data: TimeEntry) => {
    setTimeEntries((prev) => [...prev, data]);
  };

  // Get recent time entries for current employee
  const recentTimeEntries = timeEntries
    .filter((entry) => entry.employee === employee.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Render main content
  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {employee.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-2">
                  <select
                    className="text-sm bg-transparent focus:outline-none"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowAddTimeModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
                >
                  <FiPlus className="mr-2" /> Add Time
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                    <FiBriefcase className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {employeeProjects.length}
                    </h3>
                    <p className="text-gray-600 text-sm">Active Projects</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-green-600 text-sm flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    {
                      employeeProjects.filter((p) => p.status === "active")
                        .length
                    }{" "}
                    ongoing
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <FiClock className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {totalHours.toFixed(1)}
                    </h3>
                    <p className="text-gray-600 text-sm">Hours Logged</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">42.5</span> hrs this week
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-amber-100 rounded-lg mr-4">
                    <FiBarChart2 className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {recentTimeEntries.length}
                    </h3>
                    <p className="text-gray-600 text-sm">Time Entries</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">5</span> pending review
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <FiUser className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {employee.role}
                    </h3>
                    <p className="text-gray-600 text-sm">Your Role</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">
                    Team lead on <span className="font-medium">2 projects</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Projects */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      My Projects
                    </h2>
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                      View all
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {employeeProjects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setActiveView(`project-${project.id}`)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg mr-4 ${
                            project.status === "active"
                              ? "bg-green-100"
                              : project.status === "pending"
                              ? "bg-amber-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <FiBriefcase
                            className={
                              project.status === "active"
                                ? "text-green-600"
                                : project.status === "pending"
                                ? "text-amber-600"
                                : "text-gray-600"
                            }
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {project.client}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            project.status === "active"
                              ? "bg-green-100 text-green-800"
                              : project.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </span>
                        <FiChevronDown className="ml-2 text-gray-400 transform rotate-270" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Time Entries */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Time Entries
                    </h2>
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                      View all
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentTimeEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 bg-indigo-100 rounded-lg mr-4 mt-1">
                        <FiClock className="text-indigo-600 text-lg" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-900">
                            {entry.task}
                          </p>
                          <span className="text-sm font-medium text-gray-900">
                            {entry.hours}h
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {entry.project}
                        </p>
                        <p className="text-sm text-gray-500">{entry.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming Tasks
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <div className="text-center">
                    <FiCalendar className="mx-auto text-3xl text-gray-300 mb-2" />
                    <p>No upcoming tasks</p>
                    <button className="mt-3 text-indigo-600 text-sm font-medium hover:text-indigo-700">
                      Create new task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Projects
                </h1>
                <p className="text-gray-600">Manage your projects and tasks</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                  <FiFilter className="mr-2" /> Filter
                </button>
                <button className="px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                  <FiPieChart className="mr-2" /> Reports
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {employeeProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveView(`project-${project.id}`)}
                >
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div
                        className={`p-2 rounded-lg ${
                          project.status === "active"
                            ? "bg-green-100"
                            : project.status === "pending"
                            ? "bg-amber-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <FiBriefcase
                          className={
                            project.status === "active"
                              ? "text-green-600"
                              : project.status === "pending"
                              ? "text-amber-600"
                              : "text-gray-600"
                          }
                        />
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          project.status === "active"
                            ? "bg-green-100 text-green-800"
                            : project.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{project.client}</p>
                  </div>
                  <div className="p-5 bg-gray-50">
                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Start Date</p>
                        <p>{project.startDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Timeline</p>
                        <p>{project.estimatedTime}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        Team Members ({project.teamMembers.length})
                      </p>
                      <div className="flex -space-x-2">
                        {project.teamMembers
                          .slice(0, 4)
                          .map((member, index) => (
                            <div
                              key={index}
                              className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-white"
                            >
                              <span className="text-xs font-medium text-indigo-700">
                                {member[0]}
                              </span>
                            </div>
                          ))}
                        {project.teamMembers.length > 4 && (
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-xs font-medium text-gray-700">
                              +{project.teamMembers.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "timesheets":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Timesheets
                </h1>
                <p className="text-gray-600">
                  Track and manage your time entries
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                  <FiFilter className="mr-2" /> Filter
                </button>
                <button
                  onClick={() => setShowAddTimeModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
                >
                  <FiPlus className="mr-2" /> Add Entry
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Show:</span>
                  <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>All Projects</option>
                    {employeeProjects.map((project) => (
                      <option key={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">From:</span>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">To:</span>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours
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
                    {timeEntries
                      .filter((entry) => entry.employee === employee.name)
                      .map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                <FiBriefcase className="text-indigo-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {entry.project}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {entry.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">
                              {entry.task}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              {entry.hours.toFixed(2)}h
                            </span>
                          </td>
                          <td className="px-6 py-4 max-w-xs text-gray-600">
                            {entry.notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                                <FiEdit size={16} />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="p-5 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  {
                    timeEntries.filter(
                      (entry) => entry.employee === employee.name
                    ).length
                  }{" "}
                  entries
                </p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 border border-indigo-500 bg-indigo-50 rounded-lg text-sm text-indigo-600 font-medium">
                    1
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        if (activeView.startsWith("project-")) {
          const projectId = activeView.split("project-")[1];
          const project = projects.find((p) => p.id === projectId);
          if (!project) {
            return (
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                  Project not found
                </h1>
                <button
                  onClick={() => setActiveView("projects")}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Back to Projects
                </button>
              </div>
            );
          }

          const isTeamLead = project.teamLead === employee.name;
          const projectTimeEntries = timeEntries.filter(
            (entry) =>
              entry.project === project.name &&
              (isTeamLead || entry.employee === employee.name)
          );

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <button
                    onClick={() => setActiveView("projects")}
                    className="mb-3 text-indigo-600 hover:text-indigo-700 flex items-center text-sm"
                  >
                    <FiChevronLeft className="mr-1" /> Back to projects
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {project.name}
                  </h1>
                  <p className="text-gray-600">{project.client}</p>
                </div>
                <button
                  onClick={() => setShowAddTimeModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
                >
                  <FiPlus className="mr-2" /> Add Time
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Project Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Status
                      </h4>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          project.status === "active"
                            ? "bg-green-100 text-green-800"
                            : project.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Start Date
                      </h4>
                      <p className="text-gray-900">{project.startDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Timeline
                      </h4>
                      <p className="text-gray-900">{project.estimatedTime}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Your Role
                      </h4>
                      <p className="text-gray-900">
                        {project.teamLead === employee.name
                          ? "Team Lead"
                          : "Team Member"}
                      </p>
                    </div>
                  </div>

                  {isTeamLead && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        Team Members
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.teamMembers.map((member) => (
                          <span
                            key={member}
                            className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-lg flex items-center"
                          >
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Time Entries
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {isTeamLead && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Employee
                            </th>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Task
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hours
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projectTimeEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            {isTeamLead && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                {entry.employee}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {entry.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {entry.task}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {entry.hours.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">{entry.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Project Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-blue-800">
                          Total Hours
                        </h4>
                        <FiClock className="text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {projectTimeEntries
                          .reduce((total, entry) => total + entry.hours, 0)
                          .toFixed(1)}
                        h
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-green-800">
                          Tasks Completed
                        </h4>
                        <FiBriefcase className="text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-900">24</p>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-amber-800">
                          Pending Tasks
                        </h4>
                        <FiClock className="text-amber-600" />
                      </div>
                      <p className="text-2xl font-bold text-amber-900">8</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-purple-800">
                          Team Productivity
                        </h4>
                        <FiBarChart2 className="text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-900">87%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return <div>Invalid view</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
              <FiBriefcase className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-900">ProjectFlow</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1 mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-indigo-50 transition-colors ${
                activeView === item.id
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : ""
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <span
                className={`${
                  activeView === item.id ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-medium">
              {employee.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {employee.name}
              </p>
              <p className="text-xs text-gray-500">{employee.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-500 mr-4"
            >
              <FiMenu size={24} />
            </button>
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, tasks..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <FiBell className="text-gray-500 text-xl" />
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
            <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="h-9 w-9 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-medium">
                {employee.name[0]}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {employee.name}
                </p>
                <p className="text-xs text-gray-500">{employee.role}</p>
              </div>
              <FiChevronDown className="text-gray-500 hidden md:block" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">{renderMainContent()}</div>
      </div>

      {/* Add Time Entry Modal */}
      {showAddTimeModal && (
        <AddTimeEntryModal
          projects={employeeProjects}
          employeeName={employee.name}
          onSubmit={handleAddTimeEntry}
          onClose={() => setShowAddTimeModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
