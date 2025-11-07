import React, { useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import type { Project } from "../../types/project";
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
  onDeleteTime: (projectId: string, timeEntryId: string) => void;
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
    (total, entry) => total + (entry.hours || 0), // Safer sum
    0
  );

  // Helper: format a Date to YYYY-MM-DD for date input constraints
  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatDate(new Date());

  // Enforce the rules:
  // - No future dates: max = today for both inputs.
  // - "To" cannot be before selected "From": min = dateFrom for To.
  // - If user selects today's date in From, set To to today and lock both to today (min=max=today).
  // - If From is changed such that To < From, auto-set To = From.
  useEffect(() => {
    if (!dateFrom) return;

    // If from is in the future (shouldn't be possible because inputs have max),
    // clamp it to today and set To to today.
    if (dateFrom > todayStr) {
      setDateFrom(todayStr);
      setDateTo(todayStr);
      return;
    }

    // If from is today -> force to = today and lock to = today
    if (dateFrom === todayStr) {
      if (dateTo !== todayStr) setDateTo(todayStr);
      return;
    }

    // If a from is selected and to exists but is before from, bump to to = from
    if (dateTo && dateTo < dateFrom) {
      setDateTo(dateFrom);
    }

    // Also ensure to is not in the future
    if (dateTo && dateTo > todayStr) {
      setDateTo(todayStr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom]);

  // Ensure dateTo doesn't exceed today (in case it was set externally)
  useEffect(() => {
    if (!dateTo) return;
    if (dateTo > todayStr) {
      setDateTo(todayStr);
    }
    // If somehow dateTo < dateFrom, adjust it (defensive)
    if (dateFrom && dateTo < dateFrom) {
      setDateTo(dateFrom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTo, dateFrom]);

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
                // --- FIX: Use _id or id for key and value ---
                <option key={project._id || project.id} value={project._id || project.id}>
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
              // Prevent selecting future dates by setting max to today
              max={todayStr}
              onChange={(e) => {
                setDateFrom(e.target.value);
                // If user picks today's date, we'll auto-set To via effect
                if (e.target.value === todayStr) {
                  setDateTo(todayStr);
                }
              }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">To:</span>
            <input
              type="date"
              value={dateTo}
              // Min is the selected from date (if any); Max is today to prevent future dates
              min={dateFrom || undefined}
              max={todayStr}
              onChange={(e) => {
                // Respect min/max enforced by attrs; just set value
                setDateTo(e.target.value);
              }}
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
              {timeEntries.map((entry) => {
                // --- FIX: Get the project ID safely ---
                const projectId = typeof entry.project === 'object'
                                    ? entry.project?._id || entry.project?.id
                                    : entry.project;

                // --- FIX: Find project name safely ---
                const projectName = projects.find(p => (p._id || p.id) === projectId)?.name || 'Project Not Found';

                // --- FIX: Use _id or id for the key ---
                const entryId = entry._id || entry.id;

                return (
                  // --- FIX: Use the safe entryId for the key ---
                  <tr key={entryId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* --- FIX: Display the safe projectName --- */}
                      {projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* --- FIX: Format date safely --- */}
                      {entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.title || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.hours != null ? `${entry.hours}h` : 'N/A'}
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
                        disabled={!entryId} // Disable if no ID
                      >
                        <FiEdit />
                      </button>
                      <button
                        // --- FIX: Use safe projectId and entryId ---
                        onClick={() => {
                          if (projectId && entryId) {
                             onDeleteTime(projectId, entryId);
                          } else {
                             console.error("Missing project or entry ID for delete");
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                        disabled={!projectId || !entryId} // Disable if IDs missing
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
