
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
//   onAddTask: (project: Project) => void;
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
//           {/* START: ADDED TASKS BUTTON */}
//           <button
//             className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-md"
//           >
//             Assign Tasks
//           </button>
//           {/* END: ADDED TASKS BUTTON */}
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
//               onClick={() => {
//                 // Find the first project where employee is team lead
//                 const teamLeadProject = projects.find(p => 
//                   (typeof p.teamLead === "object" ? p.teamLead.id : p.teamLead) === employee.id
//                 );
//                 if (teamLeadProject) {
//                   onAddTask(teamLeadProject);
//                 }
//               }}
//               className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
//             >
//               <FiPlus className="mr-2" /> Add Task
//             </button>
//           )}
//         </div>
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
import type { Employee } from "../../apis/authService";
// Assuming Project type has 'name' and EITHER 'id' OR '_id' (or both, preferably _id)
import type { Project } from "../../types/project";
// Assuming Task type has '_id', 'title', 'project' (ID or object), 'priority', 'status', 'dueDate', 'assignedTo', 'subtasks'
import type { Task } from "../../types/task";   

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  employee: Employee; // Assuming this is the currently logged-in user
  priorityFilter: string;
  statusFilter: string;
  projectFilter: string; // This should store the PROJECT ID
  setPriorityFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setProjectFilter: (value: string) => void; // Should receive the PROJECT ID
  onAddTask: (project: Project) => void;
}

const TasksView: React.FC<TasksViewProps> = ({
  tasks = [], // Default to empty array
  projects = [], // Default to empty array
  employee,
  priorityFilter,
  statusFilter,
  projectFilter,
  setPriorityFilter,
  setStatusFilter,
  setProjectFilter,
  onAddTask,
}) => {

  // Helper function to get project name safely
  const getProjectName = (projectIdentifier: string | { _id?: string; id?: string; name?: string } | undefined | null): string => {
    // console.log('Trying to find project name for:', projectIdentifier); // Keep for debugging if needed

    if (!projectIdentifier) {
      // console.log('Input was null or undefined.');
      return "-";
    }

    if (typeof projectIdentifier === 'object' && projectIdentifier !== null && projectIdentifier.name) {
      // console.log('Found name directly in object:', projectIdentifier.name);
      return projectIdentifier.name;
    }

    const idToFind = typeof projectIdentifier === 'object'
                     ? String(projectIdentifier._id || projectIdentifier.id || '')
                     : String(projectIdentifier);

    if (!idToFind) {
      // console.log('Could not determine a valid ID to search for.');
      return "Invalid Ref";
    }

    // console.log(`Searching projects array for ID: "${idToFind}"`);

    const foundProject = projects.find(
      (p) => String(p._id || p.id || '') === idToFind // Prefer _id
    );

    if (foundProject) {
      // console.log('Found project match:', foundProject.name);
      return foundProject.name;
    } else {
      // console.warn(`Project ID "${idToFind}" not found in projects list:`, projects);
      return "Unknown"; // Shorter "Not Found" message
    }
  };

  // Check if the current employee is a team lead for any project
  const isTeamLead = projects.some(p => {
    const leadId = typeof p.teamLead === 'object' ? p.teamLead._id || p.teamLead.id : p.teamLead;
    return String(leadId) === String(employee._id || employee.id); // Compare IDs as strings
  });


  return (
    <div className="space-y-6 p-4 md:p-6"> {/* Added padding */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 text-sm sm:text-base"> {/* Adjusted text size */}
            Manage your assigned tasks and subtasks
          </p>
        </div>
        {/* Filter and Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-start sm:justify-end w-full sm:w-auto"> {/* Added flex-wrap */}

          {/* Project Filter */}
          <select
            value={projectFilter} // Stores the selected Project ID
            // Sets the projectFilter state to the selected project's ID
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm" // Adjusted text size
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              // **CRITICAL FIX**: The 'value' MUST be the project's ID (preferably _id)
              <option
                key={project._id || project.id} // Use _id primarily for key
                value={String(project._id || project.id)} // Use _id primarily for value, ensure it's a string
              >
                {project.name} {/* Display the name */}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* Add Task Button (Only if employee is a team lead) */}
          {isTeamLead && (
            <button
              onClick={() => {
                // Find the first project where the employee is the team lead
              	const teamLeadProject = projects.find(p => {
                    const leadId = typeof p.teamLead === 'object' ? p.teamLead._id || p.teamLead.id : p.teamLead;
                    return String(leadId) === String(employee._id || employee.id);
                  });
            	  if (teamLeadProject) {
            	  	onAddTask(teamLeadProject); // Pass the correct project object
            	  } else {
                    console.warn("Could not find project where user is team lead to add task.");
                    // Optionally, disable the button or handle this case
                  }
          	  }}
          	  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md text-sm" // Adjusted text size
        	  >
        	  	<FiPlus className="mr-1 sm:mr-2" /> Add Task {/* Adjusted margin */}
            </button>
          )}
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto"> {/* Added overflow-x-auto */}
        <table className="w-full min-w-[640px]"> {/* Added min-width */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              	Assignee(s)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.length > 0 ? tasks.map((task) => (
            	<React.Fragment key={task._id || task.id}> {/* Use _id primarily */}
            	  <tr className="hover:bg-gray-50 text-sm"> {/* Base text size */}
            	  	<td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {task.title}
                  </td>
            	  	<td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                        {/* Use the helper function */}
            	  	  {getProjectName(task.project)}
                  </td>
            	  	<td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
            	  	  	className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${ // Adjusted padding and added capitalize
            	  	  	  task.priority === "urgent" ? "bg-red-100 text-red-800"
            	  	  	: task.priority === "high" ? "bg-orange-100 text-orange-800"
            	  	  	: task.priority === "medium" ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
            	  	  	{task.priority}
                    </span>
                  </td>
            	  	<td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
            	  	  {task.status.replace("_", " ")}
            	  	</td>
            	  	<td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                  </td>
            	  	<td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                      {/* Display Assignee Name or ID */}
                      {typeof task.assignedTo === 'object' && task.assignedTo !== null
                        // @ts-ignore Check for name
                      ? task.assignedTo.name
                        // If just ID, display it (or lookup name if employee list available)
                        : task.assignedTo || '-'
                      }
                  </td>
                </tr>

                    {/* Subtask Rows */}
            	  {task.subtasks?.map((subtask: any) => ( // Use 'any' or define Subtask type
            	  	<tr key={subtask._id || subtask.id} className="bg-gray-50/60 hover:bg-gray-100/60 text-sm"> {/* Style subtasks differently */}
            	  	  <td className="pl-8 sm:pl-10 pr-4 sm:pr-6 py-3 whitespace-nowrap text-gray-700"> {/* Indent */}
                      ↳ {subtask.title}
                    </td>
            	  	  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-500 italic">
                          {/* Subtasks belong to the same project */}
                          {getProjectName(task.project)}
                    </td>
            	  	  <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize `}>
                            {subtask.priority}
                      </span>
                    </td>
            	  	  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-500 capitalize">
                          {subtask.status.replace("_", " ")}
                    </td>
            	  	  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-500">-</td> {/* Subtasks might not have due dates */}
            	  	  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs text-gray-500">
                          {/* Display subtask assignees */}
                          {(subtask.assignees || []).map((assignee: any) =>
                            typeof assignee === 'object' ? assignee.name : assignee // Display name or ID
                          ).join(", ") || '-'}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
        	)) : (
              // Message when no tasks match filters
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  No tasks match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksView;