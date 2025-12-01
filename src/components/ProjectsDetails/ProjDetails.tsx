import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";
import type { Employee } from "../../apis/authService";
import type { Project } from "../../types/project";
import type { Deliverable } from "../../types/deliverable";
import AddTimeEntryModal from "../../components/AddTimeEntryModal/TimeEntry";
import AddDeliverableModal from "../../components/AddDeliverbles/AddDeliveryModal";
import type { TimeEntry } from "../../types/timeEntry";

interface ProjectDetailsViewProps {
  projects: Project[];
  deliverables: Deliverable[];
  employee: Employee | null;
  onAddTask: (project: Project) => void;
  onAddDeliverable: () => void;
  setActiveView: (view: string) => void;
  onAddTime?: (formData: {
    projectId: string;
    data: Omit<
      TimeEntry,
      "_id" | "user" | "project" | "createdAt" | "updatedAt"
    >;
  }) => void;
}

const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({
  projects,
  deliverables,
  employee,
  onAddTask,
  onAddDeliverable,
  setActiveView,
  onAddTime,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isTeamLead, setIsTeamLead] = useState(false);
  const [showTimeEntryModal, setShowTimeEntryModal] = useState(false);
  const [showAddDeliverableModal, setShowAddDeliverableModal] = useState(false);

  // dynamic timesheets (no static dummy data)
  const [timesheets, setTimesheets] = useState<Array<any>>([]);
  const [loadingTimesheets, setLoadingTimesheets] = useState(false);

  useEffect(() => {
    console.log("Projects in Details:", projects);
    console.log("Deliverables:", deliverables);
    console.log("Employee:", employee);

    if (!employee) {
      console.warn("Employee data is not available");
      return;
    }

    if (projects.length > 0) {
      const currentProject = projects[0];
      console.log("Selected Project:", currentProject);
      setProject(currentProject);

      const teamLeadId =
        typeof currentProject.teamLead === "string"
          ? currentProject.teamLead
          : currentProject.teamLead?._id || currentProject.teamLead?.id;

      const employeeId = (employee as any)._id || (employee as any).id;
      setIsTeamLead(teamLeadId === employeeId);

      const projectId = currentProject._id || currentProject.id;
      if (!projectId) {
        console.error("Project ID is undefined or missing:", currentProject);
      } else {
        // try sessionStorage first (prefetched by ProjectsView)
        const key = `timesheets_${String(projectId)}`;
        try {
          const raw = sessionStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              setTimesheets(parsed);
              return;
            }
          }
        } catch (e) {
          console.warn("Failed to read timesheets from sessionStorage:", e);
        }

        // fallback: fetch directly
        (async () => {
          const API_BASE =
            import.meta.env.VITE_BACKEND_API || "http://localhost:3000";
          const url = `${API_BASE}/api/projects/${encodeURIComponent(
            String(projectId)
          )}/time-entries`;
          const token =
            localStorage.getItem("token") || localStorage.getItem("accessToken");
          const headers: Record<string, string> = { Accept: "application/json" };
          if (token) headers["Authorization"] = `Bearer ${token}`;

          setLoadingTimesheets(true);
          try {
            const res = await fetch(url, { headers, credentials: "include" });
            if (!res.ok) {
              console.debug(
                "Fetch timesheets failed:",
                res.status,
                await res.text()
              );
              setTimesheets([]);
              setLoadingTimesheets(false);
              return;
            }
            const data = await res.json();
            const entries = Array.isArray(data) ? data : data.timeEntries || [];
            setTimesheets(entries);
            try {
              sessionStorage.setItem(key, JSON.stringify(entries));
            } catch { }
          } catch (err) {
            console.debug("Fetch timesheets error:", err);
            setTimesheets([]);
          } finally {
            setLoadingTimesheets(false);
          }
        })();
      }
    }
  }, [projects, employee, deliverables]);

  const handleTimeEntrySubmit = (formData: {
    projectId: string;
    data: Omit<
      TimeEntry,
      "_id" | "user" | "project" | "createdAt" | "updatedAt"
    >;
  }) => {
    console.log("Time entry submitted:", formData);
    setShowTimeEntryModal(false);

    if (onAddTime) {
      try {
        onAddTime(formData);
      } catch (err) {
        console.error("Error calling onAddTime:", err);
      }
    }

    const newEntry = {
      _id: `local-${Date.now()}`,
      user: { name: employee?.name || "You" },
      userName: employee?.name || "You",
      date: formData.data.date,
      hours: formData.data.hours,
      title: formData.data.title,
      task: formData.data.task,
      approved: false,
    };

    setTimesheets((prev) => {
      const updated = [...prev, newEntry];
      try {
        const pid = project?._id || project?.id;
        if (pid)
          sessionStorage.setItem(
            `timesheets_${String(pid)}`,
            JSON.stringify(updated)
          );
      } catch { }
      return updated;
    });
  };

  const projectId = project ? (project._id || project.id) : "";
  if (!projectId) {
    console.error("Project ID is undefined in render:", project);
    return (
      <div className="p-4 sm:p-6">
        <button
          onClick={() => setActiveView("projects")}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Projects
        </button>
        <div className="text-center py-12">
          <p className="text-slate-500">Invalid project data</p>
        </div>
      </div>
    );
  }

  const getMemberName = (member: any): string => {
    if (typeof member === "string") return member;
    return member?.name || "Unknown Member";
  };

  const getTeamLeadName = (teamLead: any): string => {
    if (typeof teamLead === "string") return teamLead;
    return teamLead?.name || "Unknown Team Lead";
  };

  const getClientName = (client: any): string => {
    if (typeof client === "string") return client;
    return client?.name || "Unknown Client";
  };

  const getEntryUserName = (entry: any) => {
    if (entry.user && typeof entry.user === "object")
      return entry.user.name || entry.userName || "Unknown";
    return entry.userName || (entry.user ? String(entry.user) : "Unknown");
  };

  const getEntryTaskTitle = (entry: any) => {
    if (entry.title) return entry.title;
    if (entry.task && typeof entry.task === "object")
      return entry.task.title || entry.task.name || "Task";
    return "N/A";
  };

  return (
    // THEME CONTAINER
    <div className="p-4 sm:p-6 space-y-6 container">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => setActiveView("projects")}
          className="flex items-center text-blue-400 hover:text-blue-300 text-sm sm:text-base transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Projects
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowTimeEntryModal(true)}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all flex items-center text-sm sm:text-base shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/50"
          >
            <FiPlus className="mr-2" /> Enter Time Entry
          </button>
          {isTeamLead && (
            <>
              <button
                onClick={() => onAddTask(project)}
                className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all flex items-center text-sm sm:text-base border border-indigo-500/50 shadow-lg shadow-indigo-900/20"
              >
                <FiPlus className="mr-2" /> Add Task
              </button>
              <button
                onClick={() => setShowAddDeliverableModal(true)}
                className="px-3 sm:px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-all flex items-center text-sm sm:text-base border border-slate-700 hover:text-white"
              >
                <FiPlus className="mr-2" /> Add Deliverable
              </button>
            </>
          )}
        </div>
      </div>

      {/* Project Info Card */}
      <div className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {project.name}
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Client: <span className="text-slate-300">{getClientName(project.client)}</span>
            </p>
            {isTeamLead && (
              <p className="text-sm text-blue-400 mt-1 font-medium">
                You are the Team Lead
              </p>
            )}
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full border ${project.status === "active"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : project.status === "pending"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
          >
            {project.status?.charAt(0).toUpperCase() +
              project.status?.slice(1) || "Unknown"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center">
            <FiCalendar className="text-slate-500 mr-3 text-lg" />
            <div>
              <p className="text-sm text-slate-500">Start Date</p>
              <p className="font-medium text-sm sm:text-base text-slate-200">
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <FiUsers className="text-slate-500 mr-3 text-lg" />
            <div>
              <p className="text-sm text-slate-500">Team Lead</p>
              <p className="font-medium text-sm sm:text-base text-slate-200">
                {getTeamLeadName(project.teamLead)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <FiCheckCircle className="text-slate-500 mr-3 text-lg" />
            <div>
              <p className="text-sm text-slate-500">Timeline</p>
              <p className="font-medium text-sm sm:text-base text-slate-200">
                {project.estimatedTime || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Card */}
      <div className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 p-4 sm:p-6 backdrop-blur-sm">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
          Team Members
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.teamMembers?.map((member, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors"
            >
              <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center mr-3 border border-slate-700">
                <span className="text-sm font-medium text-blue-400">
                  {getMemberName(member).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base text-slate-200">
                  {getMemberName(member)}
                </p>
                <p className="text-sm text-slate-500">Team Member</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables block */}
      <div className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Deliverables
          </h2>
          <span className="bg-slate-800 text-slate-300 text-sm px-3 py-1 rounded-full border border-slate-700">
            {deliverables.length} items
          </span>
        </div>

        {deliverables.length === 0 ? (
          <div className="text-center py-8">
            <FiCheckCircle className="mx-auto text-slate-700 text-4xl mb-3" />
            <p className="text-slate-500 text-sm sm:text-base">
              No deliverables yet
            </p>
            {!isTeamLead && (
              <p className="text-sm text-slate-600 mt-2">
                Only team leads can add deliverables
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {deliverables.map((deliverable, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-950/30 hover:bg-slate-900/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm sm:text-base text-slate-200">
                    {deliverable.description}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Due:{" "}
                    {deliverable.date
                      ? new Date(deliverable.date).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {deliverable.parent && (
                    <p className="text-sm text-slate-600 mt-0.5">
                      Revision of:{" "}
                      {typeof deliverable.parent === "string"
                        ? deliverable.parent
                        : deliverable.parent.description}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${deliverable.status === "approved"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : deliverable.status === "delivered"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                >
                  {deliverable.status?.charAt(0).toUpperCase() +
                    deliverable.status?.slice(1) || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Timesheets */}
      <div className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 p-4 sm:p-6 backdrop-blur-sm overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Team Timesheets
          </h2>
          <span className="bg-slate-800 text-slate-300 text-sm px-3 py-1 rounded-full border border-slate-700">
            {timesheets.length} entries
          </span>
        </div>

        {loadingTimesheets ? (
          <div className="text-center py-8">
            <p className="text-slate-500">Loading timesheets...</p>
          </div>
        ) : timesheets.length === 0 ? (
          <div className="text-center py-8">
            <FiCalendar className="mx-auto text-slate-700 text-4xl mb-3" />
            <p className="text-slate-500 text-sm sm:text-base">
              No timesheet entries yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {timesheets.map((entry: any, idx: number) => (
                  <tr key={entry._id || entry.id || `local-${idx}`} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {getEntryUserName(entry)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">
                      {entry.date
                        ? new Date(entry.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-400 font-medium">
                      {entry.hours != null ? `${entry.hours} hours` : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {getEntryTaskTitle(entry)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${entry.approved
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                      >
                        {entry.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showTimeEntryModal && (
        <AddTimeEntryModal
          projects={projects}
          employee={employee}
          onSubmit={handleTimeEntrySubmit}
          onClose={() => setShowTimeEntryModal(false)}
          initialData={undefined}
          initialProject={project}
          isProjectDisabled={true}
        />
      )}

      {showAddDeliverableModal && (
        <AddDeliverableModal
          projectId={String(projectId)}
          employee={employee}
          onClose={() => setShowAddDeliverableModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetailsView;