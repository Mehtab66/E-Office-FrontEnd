import React, { useEffect } from "react";
import type { Employee } from "../../apis/authService";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import type { TimeEntry } from "../../types/timeEntry";

interface EmployeeDashboardStatsProps {
  employee: Employee;
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
}

const EmployeeDashboardStats: React.FC<EmployeeDashboardStatsProps> = ({
  employee,
  projects,
  tasks,
  timeEntries,
}) => {
  useEffect(() => {
    console.log("Stats updated:", { projects, tasks, timeEntries, employee });
  }, [projects, tasks, timeEntries, employee]);

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const pendingTasks = tasks.filter((t) => t.status === "todo").length;
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
        <p className="text-3xl font-bold text-indigo-600">{activeProjects}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
        <p className="text-3xl font-bold text-indigo-600">{pendingTasks}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900">Total Hours</h3>
        <p className="text-3xl font-bold text-indigo-600">{totalHours}</p>
      </div>
    </div>
  );
};

export default EmployeeDashboardStats;
