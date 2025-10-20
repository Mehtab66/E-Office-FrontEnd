// import React from "react";
// import { FiPlus } from "react-icons/fi";
// import type  { Employee } from "../../apis/authService";
// import type { Project } from "../../types/project";
// import type { Task } from "../../types/task";   
// interface TasksViewProps {
//   tasks: Task[];
//   projects: Project[];
//   employee: Employee;
//   priorityFilter: string;
//   statusFilter: string;
//   projectFilter: string;
//   setPriorityFilter: (value: string) => void;
//   setStatusFilter: (value: string) => void;
//   setProjectFilter: (value: string) => void;
//   onAddTask: () => void;
// }

// const TasksView: React.FC<TasksViewProps> = ({
//   tasks,
//   projects,
//   employee,
//   priorityFilter,
//   statusFilter,
//   projectFilter,
//   setPriorityFilter,
//   setStatusFilter,
//   setProjectFilter,
//   onAddTask,
// }) => {
//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
//           <p className="text-gray-600">Manage your assigned tasks and subtasks</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <select
//             value={priorityFilter}
//             onChange={(e) => setPriorityFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
//           >
//             <option value="">All Priorities</option>
//             <option value="urgent">Urgent</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
//           >
//             <option value="">All Statuses</option>
//             <option value="todo">To Do</option>
//             <option value="in_progress">In Progress</option>
//             <option value="done">Done</option>
//           </select>
//           <select
//             value={projectFilter}
//             onChange={(e) => setProjectFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
//           >
//             <option value="">All Projects</option>
//             {projects.map((project) => (
//               <option key={project.id} value={project.id}>
//                 {project.name}
//               </option>
//             ))}
//           </select>
//           {projects.some((p) => {
//             // If teamLead is an object with id, compare p.teamLead.id
//             // If teamLead is a string (id), compare p.teamLead
//             // Adjust as per your actual Project type
//             // @ts-ignore
//             return (typeof p.teamLead === "object" ? p.teamLead.id : p.teamLead) === employee.id;
//           }) && (
//             <button
//               onClick={onAddTask}
//               className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
//             >
//               <FiPlus className="mr-2" /> Add Task
//             </button>
//           )}

//               </div>
//       </div>
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Task
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Project
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Priority
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Due Date
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Assignees
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {tasks.map((task) => (
//               <React.Fragment key={task.id}>
//                 <tr className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
//                     {task.title}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {projects.find((p) => p.id === task.project)?.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-3 py-1 text-xs font-medium rounded-full ${
//                         task.priority === "urgent"
//                           ? "bg-red-100 text-red-800"
//                           : task.priority === "high"
//                           ? "bg-orange-100 text-orange-800"
//                           : task.priority === "medium"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("_", " ")}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">{task.dueDate || "-"}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {typeof task.assignedTo === "object" && task.assignedTo !== null
//                       ? task.assignedTo.name
//                       : task.assignedTo}
//                   </td>
//                 </tr>
//                 {task.subtasks.map((subtask: { id: React.Key | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; priority: string; status: string; assignees: any[]; }) => (
//                   <tr key={subtask.id} className="hover:bg-gray-50">
//                     <td className="px-10 py-4 whitespace-nowrap text-gray-600">
//                       ↳ {subtask.title}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {projects.find((p) => p.id === task.project)?.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-3 py-1 text-xs font-medium rounded-full ${
//                           subtask.priority === "urgent"
//                             ? "bg-red-100 text-red-800"
//                             : subtask.priority === "high"
//                             ? "bg-orange-100 text-orange-800"
//                             : subtask.priority === "medium"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {subtask.priority.charAt(0).toUpperCase() + subtask.priority.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {subtask.status.charAt(0).toUpperCase() + subtask.status.slice(1).replace("_", " ")}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">-</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {subtask.assignees.map((a) => a.name).join(", ")}
//                     </td>
//                   </tr>
//                 ))}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TasksView;
import React from "react";
import { FiPlus } from "react-icons/fi";
import type  { Employee } from "../../apis/authService";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";   
interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  employee: Employee;
  priorityFilter: string;
  statusFilter: string;
  projectFilter: string;
  setPriorityFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setProjectFilter: (value: string) => void;
  onAddTask: (project: Project) => void;
}

const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects,
  employee,
  priorityFilter,
  statusFilter,
  projectFilter,
  setPriorityFilter,
  setStatusFilter,
  setProjectFilter,
  onAddTask,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600">Manage your assigned tasks and subtasks</p>
        </div>
        <div className="flex items-center gap-3">
          {/* START: ADDED TASKS BUTTON */}
          <button
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-md"
          >
            Assign Tasks
          </button>
          {/* END: ADDED TASKS BUTTON */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {projects.some((p) => {
            // If teamLead is an object with id, compare p.teamLead.id
            // If teamLead is a string (id), compare p.teamLead
            // Adjust as per your actual Project type
            // @ts-ignore
            return (typeof p.teamLead === "object" ? p.teamLead.id : p.teamLead) === employee.id;
          }) && (
            <button
              onClick={() => {
                // Find the first project where employee is team lead
                const teamLeadProject = projects.find(p => 
                  (typeof p.teamLead === "object" ? p.teamLead.id : p.teamLead) === employee.id
                );
                if (teamLeadProject) {
                  onAddTask(teamLeadProject);
                }
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
            >
              <FiPlus className="mr-2" /> Add Task
            </button>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignees
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <React.Fragment key={task.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {projects.find((p) => p.id === task.project)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        task.priority === "urgent"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "high"
                          ? "bg-orange-100 text-orange-800"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("_", " ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{task.dueDate || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {typeof task.assignedTo === "object" && task.assignedTo !== null
                      ? task.assignedTo.name
                      : task.assignedTo}
                  </td>
                </tr>
                {task.subtasks.map((subtask: { id: React.Key | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; priority: string; status: string; assignees: any[]; }) => (
                  <tr key={subtask.id} className="hover:bg-gray-50">
                    <td className="px-10 py-4 whitespace-nowrap text-gray-600">
                      ↳ {subtask.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {projects.find((p) => p.id === task.project)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          subtask.priority === "urgent"
                            ? "bg-red-100 text-red-800"
                            : subtask.priority === "high"
                            ? "bg-orange-100 text-orange-800"
                            : subtask.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {subtask.priority.charAt(0).toUpperCase() + subtask.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subtask.status.charAt(0).toUpperCase() + subtask.status.slice(1).replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subtask.assignees.map((a) => a.name).join(", ")}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksView;