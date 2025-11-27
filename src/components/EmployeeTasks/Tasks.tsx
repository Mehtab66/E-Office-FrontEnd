// import React, { useMemo, useState } from "react";
// import { FiPlus } from "react-icons/fi";
// import type { Employee } from "../../apis/authService";
// import type { Project } from "../../types/project";
// import type { Task } from "../../types/task";

// interface TasksViewProps {
//   tasks: Task[];
//   projects: Project[] | any;
//   employee: Employee;
//   priorityFilter: string;
//   statusFilter: string;
//   projectFilter: string;
//   setPriorityFilter: (value: string) => void;
//   setStatusFilter: (value: string) => void;
//   setProjectFilter: (value: string) => void;
//   // onAddTask now accepts a Project or null -> null means "open modal with no preselected project"
//   onAddTask: (project: Project | null) => void;
// }

// const TasksView: React.FC<TasksViewProps> = ({
//   tasks = [],
//   projects = [],
//   employee,
//   priorityFilter,
//   statusFilter,
//   projectFilter,
//   setPriorityFilter,
//   setStatusFilter,
//   setProjectFilter,
//   onAddTask,
// }) => {
//   // Normalize projects input into a clean array of Project-like objects
//   const allProjects = useMemo(() => {
//     let arr: any[] = [];
//     if (!projects) return [];
//     if (Array.isArray(projects)) arr = projects;
//     else if (Array.isArray(projects.projects)) arr = projects.projects;
//     else if (Array.isArray(projects.data)) arr = projects.data;
//     else {
//       const vals = Object.values(projects);
//       if (vals.every((v) => typeof v === "object")) arr = vals as any[];
//     }

//     const normalized = arr
//       .map((p) => {
//         const id = String(p._id || p.id || "");
//         return {
//           ...p,
//           _id: id,
//           id,
//           name: p.name || p.title || `Project ${id.slice(0, 6)}`,
//           teamLead: p.teamLead ?? p.lead ?? p.owner,
//         } as Project;
//       })
//       .filter((p) => p._id);

//     const map = new Map<string, Project>();
//     for (const p of normalized) {
//       if (!map.has(p._id)) map.set(p._id, p);
//     }
//     return Array.from(map.values()).sort((a, b) => String(a.name).localeCompare(String(b.name)));
//   }, [projects]);

//   // NOTE: removed outside selectedProjectId dropdown. Add-task project selection should be inside modal.

//   // Helper to get project name for display in table
//   const getProjectName = (projectIdentifier: any): string => {
//     if (!projectIdentifier) return "-";
//     if (typeof projectIdentifier === "object" && projectIdentifier.name) return projectIdentifier.name;
//     const idToFind = typeof projectIdentifier === "object" ? String(projectIdentifier._id || projectIdentifier.id || "") : String(projectIdentifier);
//     if (!idToFind) return "Invalid Ref";
//     const found = allProjects.find((p) => String(p._id || p.id) === idToFind);
//     return found ? found.name : "Unknown";
//   };

//   const isTeamLead = useMemo(() => {
//     return allProjects.some((p) => {
//       const leadId = typeof p.teamLead === "object" ? p.teamLead._id || p.teamLead.id : p.teamLead;
//       return String(leadId) === String(employee._id || employee.id);
//     });
//   }, [allProjects, employee]);

//   return (
//     <div className="space-y-6 p-4 md:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
//           <p className="text-gray-600 text-sm sm:text-base">Manage your assigned tasks and subtasks</p>
//         </div>

//         {/* Filters + Add Task controls */}
//         <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
//           {/* Project filter (existing) */}
//           <select
//             value={String(projectFilter || "")}
//             onChange={(e) => setProjectFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
//           >
//             <option value="">All Projects</option>
//             {allProjects.map((project) => (
//               <option key={project._id || project.id} value={String(project._id || project.id)}>
//                 {project.name}
//               </option>
//             ))}
//           </select>

//           {/* Priority and status filters (existing) */}
//           <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm">
//             <option value="">All Priorities</option>
//             <option value="urgent">Urgent</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>

//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm">
//             <option value="">All Statuses</option>
//             <option value="todo">To Do</option>
//             <option value="in_progress">In Progress</option>
//             <option value="done">Done</option>
//           </select>

//           {/* Add Task button now opens modal without a preselected project */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => {
//                 // pass null -> modal should show project dropdown inside itself
//                 onAddTask(null);
//               }}
//               className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md text-sm"
//             >
//               <FiPlus className="mr-1 sm:mr-2" /> Add Task
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Task table (unchanged except using normalized project lookup) */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
//         <table className="w-full min-w-[640px]">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
//               <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
//               <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
//               <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
//               <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee(s)</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {tasks.length > 0 ? (
//               tasks.map((task) => (
//                 <React.Fragment key={task._id || task.id}>
//                   <tr className="hover:bg-gray-50 text-sm">
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">{task.title}</td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{getProjectName(task.project)}</td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${task.priority === "urgent" ? "bg-red-100 text-red-800" : task.priority === "high" ? "bg-orange-100 text-orange-800" : task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
//                         {task.priority}
//                       </span>
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 capitalize">{task.status.replace("_", " ")}</td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{typeof task.assignedTo === "object" && task.assignedTo !== null ? task.assignedTo.name : task.assignedTo || "-"}</td>
//                   </tr>

//                   {task.subtasks?.map((subtask: any) => (
//                     <tr key={subtask._id || subtask.id} className="bg-gray-50/60 hover:bg-gray-100/60 text-sm">
//                       <td className="pl-8 sm:pl-10 pr-4 sm:pr-6 py-3 whitespace-nowrap text-gray-700">↳ {subtask.title}</td>
//                       <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-500 italic">{getProjectName(task.project)}</td>
//                       <td className="px-4 sm:px-6 py-3 whitespace-nowrap"><span className="px-2 py-0.5 text-xs font-semibold rounded-full capitalize ">{subtask.priority}</span></td>
//                       <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-500 capitalize">{subtask.status.replace("_", " ")}</td>
//                       <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-500">-</td>
//                       <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs text-gray-500">{(subtask.assignees || []).map((assignee: any) => typeof assignee === "object" ? assignee.name : assignee).join(", ") || "-"}</td>
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="text-center p-6 text-gray-500">No tasks match the current filters.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TasksView;
import React, { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import type { Employee } from "../../apis/authService";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";

interface TasksViewProps {
  tasks: Task[];
  projects: Project[] | any;
  employee: Employee;
  priorityFilter: string;
  statusFilter: string;
  projectFilter: string;
  setPriorityFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setProjectFilter: (value: string) => void;
  // onAddTask now accepts a Project or null -> null means "open modal with no preselected project"
  onAddTask: (project: Project | null) => void;
}

const TasksView: React.FC<TasksViewProps> = ({
  tasks = [],
  projects = [],
  employee,
  priorityFilter,
  statusFilter,
  projectFilter,
  setPriorityFilter,
  setStatusFilter,
  setProjectFilter,
  onAddTask,
}) => {
  // Normalize projects input into a clean array of Project-like objects
  const allProjects = useMemo(() => {
    let arr: any[] = [];
    if (!projects) return [];
    if (Array.isArray(projects)) arr = projects;
    else if (Array.isArray(projects.projects)) arr = projects.projects;
    else if (Array.isArray(projects.data)) arr = projects.data;
    else {
      const vals = Object.values(projects);
      if (vals.every((v) => typeof v === "object")) arr = vals as any[];
    }

    const normalized = arr
      .map((p) => {
        const id = String(p._id || p.id || "");
        return {
          ...p,
          _id: id,
          id,
          name: p.name || p.title || `Project ${id.slice(0, 6)}`,
          teamLead: p.teamLead ?? p.lead ?? p.owner,
        } as Project;
      })
      .filter((p) => p._id);

    const map = new Map<string, Project>();
    for (const p of normalized) {
      if (!map.has(p._id)) map.set(p._id, p);
    }
    return Array.from(map.values()).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [projects]);

  // NOTE: removed outside selectedProjectId dropdown. Add-task project selection should be inside modal.

  // Helper to get project name for display in table
  const getProjectName = (projectIdentifier: any): string => {
    if (!projectIdentifier) return "-";
    if (typeof projectIdentifier === "object" && projectIdentifier.name) return projectIdentifier.name;
    const idToFind = typeof projectIdentifier === "object" ? String(projectIdentifier._id || projectIdentifier.id || "") : String(projectIdentifier);
    if (!idToFind) return "Invalid Ref";
    const found = allProjects.find((p) => String(p._id || p.id) === idToFind);
    return found ? found.name : "Unknown";
  };

  const isTeamLead = useMemo(() => {
    return allProjects.some((p) => {
      const leadId = typeof p.teamLead === "object" ? p.teamLead._id || p.teamLead.id : p.teamLead;
      return String(leadId) === String(employee._id || employee.id);
    });
  }, [allProjects, employee]);

  const handleClearFilters = () => {
    setProjectFilter("");
    setPriorityFilter("");
    setStatusFilter("");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your assigned tasks and subtasks</p>
        </div>

        {/* Only Add Task remains in header (filters moved below to match Timesheets) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // pass null -> modal should show project dropdown inside itself
                onAddTask(null);
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md text-sm"
            >
              <FiPlus className="mr-1 sm:mr-2" /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Filters moved into a bar above the table (same position/structure as TimesheetsView) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Project:</span>
            <select
              value={String(projectFilter || "")}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-sm"
            >
              <option value="">All Projects</option>
              {allProjects.map((project) => (
                <option key={project._id || project.id} value={String(project._id || project.id)}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-sm"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Task table (unchanged except using normalized project lookup) */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee(s)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <React.Fragment key={task._id || task.id}>
                    <tr className="hover:bg-gray-50 text-sm">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">{task.title}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{getProjectName(task.project)}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${task.priority === "urgent" ? "bg-red-100 text-red-800" : task.priority === "high" ? "bg-orange-100 text-orange-800" : task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 capitalize">{task.status.replace("_", " ")}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{typeof task.assignedTo === "object" && task.assignedTo !== null ? task.assignedTo.name : task.assignedTo || "-"}</td>
                    </tr>

                    {task.subtasks?.map((subtask: any) => (
                      <tr key={subtask._id || subtask.id} className="bg-gray-50/60 hover:bg-gray-100/60 text-sm">
                        <td className="pl-8 sm:pl-10 pr-4 sm:pr-6 py-3 whitespace-nowrap text-gray-700">↳ {subtask.title}</td>
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-500 italic">{getProjectName(task.project)}</td>
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap"><span className="px-2 py-0.5 text-xs font-semibold rounded-full capitalize ">{subtask.priority}</span></td>
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-500 capitalize">{subtask.status.replace("_", " ")}</td>
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-500">-</td>
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs text-gray-500">-</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-gray-500">No tasks match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TasksView;
