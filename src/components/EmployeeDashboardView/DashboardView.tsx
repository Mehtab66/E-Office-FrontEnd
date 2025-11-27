import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { toast } from "react-toastify";
import {
  FiBriefcase,
  FiClock,
  FiBarChart2,
  FiUser,
  FiPlus,
  FiBell,
} from "react-icons/fi";
import type { Project } from "../../types/project";
import type { TimeEntry } from "../../types/timeEntry";
import type { Task } from "../../types/task";
import type { Employee } from "../../apis/authService";

interface DashboardViewProps {
  employee: Employee;
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  setActiveView: (view: string) => void;
  onAddTime: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  employee,
  projects,
  tasks,
  timeEntries,
  setActiveView,
  onAddTime,
}) => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    console.log("DashboardView rendered");
    console.log("Projects in the Dashboard View:", projects);
    console.log("Tasks in the Dashboard View:", tasks);
    console.log("Time Entries in the Dashboard View:", timeEntries);
  }, [projects, tasks, timeEntries]);

  useEffect(() => {
    if (socket) {
      socket.on("new_task", (data: any) => {
        console.log("New task notification received:", data);
        toast.info(data.message);
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        socket.off("new_task");
      };
    }
  }, [socket]);

  const totalHours = timeEntries.reduce(
    (total, entry) => total + entry.hours,
    0
  );

  // Get employee ID (handling both _id and id)
  const employeeId = (employee as any)._id || employee.id;

  // Count projects where the employee is team lead
  const teamLeadProjectsCount = projects.filter((project) => {
    const teamLeadId =
      typeof project.teamLead === "string"
        ? project.teamLead
        : (project.teamLead as any)?._id || (project.teamLead as any)?.id;

    return teamLeadId === employeeId;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {employee.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) setUnreadCount(0);
              }}
            >
              <FiBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-xs text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif, index) => (
                      <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                        <p className="text-sm text-gray-800">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg mr-4">
              <FiBriefcase className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {projects.length}
              </h3>
              <p className="text-gray-600 text-sm">Active Projects</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-green-600 text-sm flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              {projects.filter((p) => p.status === "active").length} ongoing
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
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg mr-4">
              <FiBarChart2 className="text-amber-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {tasks.length}
              </h3>
              <p className="text-gray-600 text-sm">Assigned Tasks</p>
            </div>
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
              Team lead on{" "}
              <span className="font-medium">
                {teamLeadProjectsCount} projects
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                My Projects
              </h2>
              <button
                className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                onClick={() => setActiveView("projects")}
              >
                View all
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setActiveView(`project-${project.id}`)}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg mr-4 ${project.status === "active"
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
                      {typeof project.client === "string"
                        ? project.client
                        : project.client?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${project.status === "active"
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
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Time Entries
              </h2>
              <button
                className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                onClick={() => setActiveView("timesheets")}
              >
                View all
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {timeEntries.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-start p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-indigo-100 rounded-lg mr-4 mt-1">
                  <FiClock className="text-indigo-600 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-900">{entry.title}</p>
                    <span className="text-sm font-medium text-gray-900">
                      {entry.hours}h
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {projects.find((p) => p.id === entry.project)?.name}
                  </p>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
