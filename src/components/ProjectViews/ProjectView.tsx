// import React, { useEffect } from "react";
// import { FiBriefcase, FiPlus } from "react-icons/fi";
// import type { Employee } from "../../apis/authService";
// import type { Project } from "../../types/project";

// interface ProjectsViewProps {
//   projects: Project[];
//   employee: Employee;
//   setActiveView: (view: string) => void;
//   onAddTask: (project?: Project) => void;
//   onAddDeliverable: () => void;
// }

// const ProjectsView: React.FC<ProjectsViewProps> = ({
//   projects,
//   employee,
//   setActiveView,
//   onAddTask,
// }) => {
//   useEffect(() => {
//     console.log("Projects updated:", projects);
//   }, [projects]);

//   const getMemberName = (member: any) =>
//     typeof member === "string" ? member : member?.name || "Unknown";
//   const getMemberInitial = (member: any) => getMemberName(member).charAt(0).toUpperCase();

//   // Prefetch timesheets for a project and store in sessionStorage so ProjectDetailsView can read them.
//   // ProjectsView.tsx — replace the existing function with this exact code
//   const prefetchTimesheetsForProject = async (projectId?: string | number) => {
//     if (!projectId) return;
//     const idStr = String(projectId);
//     const API_BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";

//     // Try several common storage keys for token
//     const token =
//       localStorage.getItem("authToken") ||
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       (() => {
//         const raw = localStorage.getItem("auth-storage");
//         if (!raw) return null;
//         try {
//           const parsed = JSON.parse(raw);
//           return parsed?.state?.token || parsed?.token || null;
//         } catch {
//           return null;
//         }
//       })() ||
//       null;

//     // If you use cookie-based auth instead, you can omit Authorization and use credentials:'include'
//     if (!token) {
//       console.debug("No token found in localStorage — skipping prefetch");
//       return;
//     }

//     // NOTE: include the `/api` prefix because backend mounts routes under /api/projects
//     const url = `${API_BASE}/api/projects/${encodeURIComponent(idStr)}/time-entries`;

//     try {
//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         // uncomment if your auth uses cookies:
//         // credentials: "include",
//       });

//       if (!res.ok) {
//         console.debug(`Prefetch failed: ${url} (${res.status})`);
//         return;
//       }

//       const data = await res.json();
//       // backend returns an array for project-scoped route; handle both shapes
//       const entries = Array.isArray(data) ? data : Array.isArray(data.timeEntries) ? data.timeEntries : [];
//       if (entries.length) {
//         sessionStorage.setItem(`timesheets_${idStr}`, JSON.stringify(entries));
//       }
//     } catch (err) {
//       console.debug("Prefetch error:", err);
//     }
//   };


//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
//           <p className="text-gray-600">Manage your projects and tasks</p>
//         </div>
//         <div className="flex items-center gap-3">
//           {projects.some((p) => {
//             const teamLeadId =
//               typeof p.teamLead === "string"
//                 ? p.teamLead
//                 : p.teamLead?._id || p.teamLead?.id;
//             return teamLeadId === employee.id;
//           }) && (
//               <button
//                 onClick={() => onAddTask()}
//                 className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
//               >
//                 <FiPlus className="mr-2" /> Add Task
//               </button>
//             )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//         {projects.map((project) => {
//           const projectKey = project.id || project._id;
//           return (
//             <div
//               key={projectKey}
//               className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
//               onClick={async () => {
//                 // prefetch timesheets for this project, then navigate to details view
//                 await prefetchTimesheetsForProject(projectKey);
//                 setActiveView(`project-${projectKey}`);
//               }}
//             >
//               <div className="p-5 border-b border-gray-100">
//                 <div className="flex justify-between items-start mb-3">
//                   <div
//                     className={`p-2 rounded-lg ${project.status === "active"
//                       ? "bg-green-100"
//                       : project.status === "pending"
//                         ? "bg-amber-100"
//                         : "bg-gray-100"
//                       }`}
//                   >
//                     <FiBriefcase
//                       className={
//                         project.status === "active"
//                           ? "text-green-600"
//                           : project.status === "pending"
//                             ? "text-amber-600"
//                             : "text-gray-600"
//                       }
//                     />
//                   </div>
//                   <span
//                     className={`px-3 py-1 text-xs font-medium rounded-full ${project.status === "active"
//                       ? "bg-green-100 text-green-800"
//                       : project.status === "pending"
//                         ? "bg-amber-100 text-amber-800"
//                         : "bg-gray-100 text-gray-800"
//                       }`}
//                   >
//                     {project.status &&
//                       project.status.charAt(0).toUpperCase() +
//                       project.status.slice(1)}
//                   </span>
//                 </div>
//                 <h3 className="font-semibold text-lg text-gray-900 mb-1">
//                   {project.name}
//                 </h3>
//                 <p className="text-gray-600 text-sm">
//                   {typeof project.client === "string"
//                     ? project.client
//                     : project.client?.name || "Unknown Client"}
//                 </p>
//               </div>

//               <div className="p-5 bg-gray-50">
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <div>
//                     <p className="font-medium">Start Date</p>
//                     <p>
//                       {project.startDate
//                         ? new Date(project.startDate).toLocaleDateString()
//                         : "N/A"}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium">Timeline</p>
//                     <p>{project.estimatedTime || "N/A"}</p>
//                   </div>
//                 </div>

//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <p className="text-sm text-gray-600 mb-2">
//                     Team Members ({project.teamMembers?.length || 0})
//                   </p>
//                   <div className="flex -space-x-2">
//                     {project.teamMembers?.slice(0, 4).map((member, index) => (
//                       <div
//                         key={index}
//                         className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-white"
//                       >
//                         <span className="text-xs font-medium text-indigo-700">
//                           {getMemberInitial(member)}
//                         </span>
//                       </div>
//                     ))}
//                     {project.teamMembers && project.teamMembers.length > 4 && (
//                       <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
//                         <span className="text-xs font-medium text-gray-700">
//                           +{project.teamMembers.length - 4}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ProjectsView;
import React, { useEffect } from "react";
import { FiBriefcase, FiPlus } from "react-icons/fi";
import type { Employee } from "../../apis/authService";
import type { Project } from "../../types/project";

interface ProjectsViewProps {
  projects: Project[];
  employee: Employee;
  setActiveView: (view: string) => void;
  onAddTask: (project?: Project) => void;
  onAddDeliverable: () => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  employee,
  setActiveView,
  onAddTask,
}) => {
  useEffect(() => {
    console.log("Projects updated:", projects);
  }, [projects]);

  const getMemberName = (member: any) =>
    typeof member === "string" ? member : member?.name || "Unknown";
  const getMemberInitial = (member: any) => getMemberName(member).charAt(0).toUpperCase();

  const prefetchTimesheetsForProject = async (projectId?: string | number) => {
    if (!projectId) return;
    const idStr = String(projectId);
    const API_BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";

    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      (() => {
        const raw = localStorage.getItem("auth-storage");
        if (!raw) return null;
        try {
          const parsed = JSON.parse(raw);
          return parsed?.state?.token || parsed?.token || null;
        } catch {
          return null;
        }
      })() ||
      null;

    if (!token) {
      console.debug("No token found in localStorage — skipping prefetch");
      return;
    }

    const url = `${API_BASE}/api/projects/${encodeURIComponent(idStr)}/time-entries`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.debug(`Prefetch failed: ${url} (${res.status})`);
        return;
      }

      const data = await res.json();
      const entries = Array.isArray(data) ? data : Array.isArray(data.timeEntries) ? data.timeEntries : [];
      if (entries.length) {
        sessionStorage.setItem(`timesheets_${idStr}`, JSON.stringify(entries));
      }
    } catch (err) {
      console.debug("Prefetch error:", err);
    }
  };


  return (
    // THEME CONTAINER
    <div className="space-y-6 container px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Projects</h1>
          <p className="text-slate-400">Manage your projects and tasks</p>
        </div>
        <div className="flex items-center gap-3">
          {projects.some((p) => {
            const teamLeadId =
              typeof p.teamLead === "string"
                ? p.teamLead
                : p.teamLead?._id || p.teamLead?.id;
            return teamLeadId === employee.id;
          }) && (
              <button
                onClick={() => onAddTask()}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all flex items-center shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-500/50"
              >
                <FiPlus className="mr-2" /> Add Task
              </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project) => {
          const projectKey = project.id || project._id;
          return (
            <div
              key={projectKey}
              className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all cursor-pointer backdrop-blur-sm group"
              onClick={async () => {
                await prefetchTimesheetsForProject(projectKey);
                setActiveView(`project-${projectKey}`);
              }}
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950/30">
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`p-2 rounded-lg border ${project.status === "active"
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : project.status === "pending"
                        ? "bg-amber-500/10 border-amber-500/20"
                        : "bg-slate-800 border-slate-700"
                      }`}
                  >
                    <FiBriefcase
                      className={
                        project.status === "active"
                          ? "text-emerald-400"
                          : project.status === "pending"
                            ? "text-amber-400"
                            : "text-slate-400"
                      }
                    />
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full border ${project.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : project.status === "pending"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                  >
                    {project.status &&
                      project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
                <p className="text-slate-400 text-sm">
                  {typeof project.client === "string"
                    ? project.client
                    : project.client?.name || "Unknown Client"}
                </p>
              </div>

              <div className="p-5 bg-slate-900/50">
                <div className="flex justify-between text-sm text-slate-400">
                  <div>
                    <p className="font-medium text-slate-300">Start Date</p>
                    <p>
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-300">Timeline</p>
                    <p>{project.estimatedTime || "N/A"}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-2">
                    Team Members ({project.teamMembers?.length || 0})
                  </p>
                  <div className="flex -space-x-2">
                    {project.teamMembers?.slice(0, 4).map((member, index) => (
                      <div
                        key={index}
                        className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-900 text-slate-300 ring-1 ring-slate-700"
                      >
                        <span className="text-xs font-medium">
                          {getMemberInitial(member)}
                        </span>
                      </div>
                    ))}
                    {project.teamMembers && project.teamMembers.length > 4 && (
                      <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-900 text-slate-400 ring-1 ring-slate-700">
                        <span className="text-xs font-medium">
                          +{project.teamMembers.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsView;