import React from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import type{ Project } from "../../types/project";
import type { TimeEntry } from "../../types/timeEntry";
interface TimesheetsViewProps {
  timeEntries: TimeEntry[];
  projects: Project[];
  projectFilter: string;
  dateFrom: string;
  dateTo: string;
  setProjectFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  onAddTime: () => void;
  onEditTime: (entry: TimeEntry) => void;
  onDeleteTime: (projectId: string, timeEntryId: string) => void; // ✅ updated
}

const TimesheetsView: React.FC<TimesheetsViewProps> = ({
  timeEntries,
  projects,
  projectFilter,
  dateFrom,
  dateTo,
  setProjectFilter,
  setDateFrom,
  setDateTo,
  onAddTime,
  onEditTime,
  onDeleteTime,
}) => {
  const totalHours = timeEntries.reduce(
    (total, entry) => total + entry.hours,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Timesheets</h1>
          <p className="text-gray-600">Track and manage your time entries</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddTime}
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
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {projects.find((p) => p.id === entry.project)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.hours}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {entry.note || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        entry.approved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {entry.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                    <button
                      onClick={() => onEditTime(entry)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => onDeleteTime(entry.project, entry.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900">
            Total Hours: {totalHours.toFixed(1)}h
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimesheetsView;
