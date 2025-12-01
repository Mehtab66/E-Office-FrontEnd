// import React, { useEffect, useState } from "react";
// import { useSocket } from "../../context/SocketContext";
// import { toast } from "react-toastify";
// import {
//   FiBriefcase,
//   FiClock,
//   FiBarChart2,
//   FiUser,
//   FiPlus,
//   FiBell,
//   FiMail,
// } from "react-icons/fi";
// import { FaEnvelopeOpen } from "react-icons/fa";
// import notificationService, { type Notification } from "../../services/notificationService";
// import type { Project } from "../../types/project";
// import type { TimeEntry } from "../../types/timeEntry";
// import type { Task } from "../../types/task";
// import type { Employee } from "../../apis/authService";

// interface DashboardViewProps {
//   employee: Employee;
//   projects: Project[];
//   tasks: Task[];
//   timeEntries: TimeEntry[];
//   setActiveView: (view: string) => void;
//   onAddTime: () => void;
// }

// const DashboardView: React.FC<DashboardViewProps> = ({
//   employee,
//   projects,
//   tasks,
//   timeEntries,
//   setActiveView,
//   onAddTime,
// }) => {
//   const { socket } = useSocket();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showNotifications, setShowNotifications] = useState(false);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const data = await notificationService.getNotifications();
//       setNotifications(data);
//       setUnreadCount(data.filter((n) => !n.isRead).length);
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//     }
//   };

//   const handleMarkAsRead = async (id: string) => {
//     try {
//       await notificationService.markAsRead(id);
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//       );
//       setUnreadCount((prev) => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error("Failed to mark notification as read:", error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await notificationService.markAllAsRead();
//       setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
//       setUnreadCount(0);
//     } catch (error) {
//       console.error("Failed to mark all notifications as read:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("DashboardView rendered");
//     console.log("Projects in the Dashboard View:", projects);
//     console.log("Tasks in the Dashboard View:", tasks);
//     console.log("Time Entries in the Dashboard View:", timeEntries);
//   }, [projects, tasks, timeEntries]);

//   useEffect(() => {
//     if (socket) {
//       socket.on("new_task", (data: any) => {
//         console.log("New task notification received:", data);
//         toast.info(data.message);
//         // Add the new notification to the list if it's included in the payload
//         if (data.notification) {
//           setNotifications((prev) => [data.notification, ...prev]);
//           setUnreadCount((prev) => prev + 1);
//         } else {
//           // Fallback if notification object isn't sent (shouldn't happen with updated backend)
//           fetchNotifications();
//         }
//       });

//       return () => {
//         socket.off("new_task");
//       };
//     }
//   }, [socket]);

//   const totalHours = timeEntries.reduce(
//     (total, entry) => total + entry.hours,
//     0
//   );

//   // Get employee ID (handling both _id and id)
//   const employeeId = (employee as any)._id || employee.id;

//   // Count projects where the employee is team lead
//   const teamLeadProjectsCount = projects.filter((project) => {
//     const teamLeadId =
//       typeof project.teamLead === "string"
//         ? project.teamLead
//         : (project.teamLead as any)?._id || (project.teamLead as any)?.id;

//     return teamLeadId === employeeId;
//   }).length;

//   return (
//     // THEME CONTAINER
//     <div className="space-y-6 container px-4 py-6">

//       {/* Header Area */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
//           <p className="text-slate-400">Welcome back, <span className="text-blue-400">{employee.name}</span></p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <button
//               className="p-2.5 rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 relative"
//               onClick={() => {
//                 setShowNotifications(!showNotifications);
//               }}
//             >
//               <FiBell className="text-xl" />
//               {unreadCount > 0 && (
//                 <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900 animate-pulse">
//                 </span>
//               )}
//             </button>

//             {/* Notification Dropdown - Dark Theme */}
//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 z-50 max-h-96 overflow-y-auto backdrop-blur-md">
//                 <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
//                   <h3 className="font-semibold text-white">Notifications</h3>
//                   <button
//                     onClick={handleMarkAllAsRead}
//                     disabled={unreadCount === 0}
//                     className={`text-xs font-medium transition-colors ${unreadCount > 0
//                       ? "text-blue-400 hover:text-blue-300 cursor-pointer"
//                       : "text-slate-600 cursor-not-allowed"
//                       }`}
//                   >
//                     Mark all as read
//                   </button>
//                 </div>
//                 <div className="divide-y divide-slate-800">
//                   {notifications.length === 0 ? (
//                     <div className="p-8 text-center text-slate-500 text-sm">
//                       No notifications
//                     </div>
//                   ) : (
//                     notifications.map((notif) => (
//                       <div
//                         key={notif._id}
//                         className={`p-3 hover:bg-slate-800/50 transition-colors flex items-start gap-3 ${!notif.isRead ? "bg-blue-900/10" : ""
//                           }`}
//                       >
//                         <div className="mt-1 flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={notif.isRead}
//                             onChange={(e) => {
//                               if (e.target.checked && !notif.isRead) {
//                                 handleMarkAsRead(notif._id);
//                               }
//                             }}
//                             className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/50 cursor-pointer"
//                             disabled={notif.isRead}
//                           />
//                           {notif.isRead ? (
//                             <FaEnvelopeOpen className="text-slate-600" />
//                           ) : (
//                             <FiMail className="text-blue-500" />
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <p
//                             className={`text-sm ${!notif.isRead
//                               ? "font-semibold text-slate-200"
//                               : "text-slate-500"
//                               }`}
//                           >
//                             {notif.message}
//                           </p>
//                           <p className="text-xs text-slate-600 mt-1">
//                             {new Date(notif.createdAt).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//         <div className="bg-slate-900/80 p-5 rounded-xl shadow-xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
//           <div className="flex items-center">
//             <div className="p-3 bg-blue-500/10 rounded-lg mr-4 border border-blue-500/20">
//               <FiBriefcase className="text-blue-400 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-white">
//                 {projects.length}
//               </h3>
//               <p className="text-slate-400 text-sm">Active Projects</p>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t border-slate-800">
//             <p className="text-emerald-400 text-sm flex items-center">
//               <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
//               {projects.filter((p) => p.status === "active").length} ongoing
//             </p>
//           </div>
//         </div>

//         <div className="bg-slate-900/80 p-5 rounded-xl shadow-xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
//           <div className="flex items-center">
//             <div className="p-3 bg-purple-500/10 rounded-lg mr-4 border border-purple-500/20">
//               <FiClock className="text-purple-400 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-white">
//                 {totalHours.toFixed(1)}
//               </h3>
//               <p className="text-slate-400 text-sm">Hours Logged</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-slate-900/80 p-5 rounded-xl shadow-xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
//           <div className="flex items-center">
//             <div className="p-3 bg-amber-500/10 rounded-lg mr-4 border border-amber-500/20">
//               <FiBarChart2 className="text-amber-400 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-white">
//                 {tasks.length}
//               </h3>
//               <p className="text-slate-400 text-sm">Assigned Tasks</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-slate-900/80 p-5 rounded-xl shadow-xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
//           <div className="flex items-center">
//             <div className="p-3 bg-emerald-500/10 rounded-lg mr-4 border border-emerald-500/20">
//               <FiUser className="text-emerald-400 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-white">
//                 {employee.role ? employee.role.replace("_", " ").charAt(0).toUpperCase() + employee.role.slice(1).replace("_", " ") : "N/A"}
//               </h3>
//               <p className="text-slate-400 text-sm">Your Role</p>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t border-slate-800">
//             <p className="text-slate-400 text-sm">
//               Team lead on{" "}
//               <span className="font-medium text-white">
//                 {teamLeadProjectsCount} projects
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         {/* Projects List */}
//         <div className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
//           <div className="p-6 border-b border-slate-800 flex justify-between items-center">
//             <h2 className="text-lg font-semibold text-white">
//               My Projects
//             </h2>
//             <button
//               className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
//               onClick={() => setActiveView("projects")}
//             >
//               View all
//             </button>
//           </div>
//           <div className="divide-y divide-slate-800">
//             {projects.length === 0 ? (
//               <div className="p-8 text-center text-slate-500">No projects found.</div>
//             ) : (
//               projects.slice(0, 3).map((project) => (
//                 <div
//                   key={project.id}
//                   className="flex justify-between items-center p-5 hover:bg-slate-800/30 transition-colors"
//                 >
//                   <div className="flex items-center">
//                     <div
//                       className={`p-2 rounded-lg mr-4 border ${project.status === "active"
//                         ? "bg-emerald-500/10 border-emerald-500/20"
//                         : project.status === "pending"
//                           ? "bg-amber-500/10 border-amber-500/20"
//                           : "bg-slate-800 border-slate-700"
//                         }`}
//                     >
//                       <FiBriefcase
//                         className={
//                           project.status === "active"
//                             ? "text-emerald-400"
//                             : project.status === "pending"
//                               ? "text-amber-400"
//                               : "text-slate-400"
//                         }
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-slate-200">
//                         {project.name}
//                       </h3>
//                       <p className="text-sm text-slate-500">
//                         {typeof project.client === "string"
//                           ? project.client
//                           : project.client?.name}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <span
//                       className={`px-2.5 py-1 text-xs font-medium rounded-full border ${project.status === "active"
//                         ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
//                         : project.status === "pending"
//                           ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
//                           : "bg-slate-800 text-slate-400 border-slate-700"
//                         }`}
//                     >
//                       {project.status.charAt(0).toUpperCase() +
//                         project.status.slice(1)}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Recent Time Entries */}
//         <div className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
//           <div className="p-6 border-b border-slate-800 flex justify-between items-center">
//             <h2 className="text-lg font-semibold text-white">
//               Recent Time Entries
//             </h2>
//             <button
//               className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
//               onClick={() => setActiveView("timesheets")}
//             >
//               View all
//             </button>
//           </div>
//           <div className="divide-y divide-slate-800">
//             {timeEntries.length === 0 ? (
//               <div className="p-8 text-center text-slate-500">No time entries recorded.</div>
//             ) : (
//               timeEntries.slice(0, 5).map((entry) => (
//                 <div
//                   key={entry.id}
//                   className="flex items-start p-5 hover:bg-slate-800/30 transition-colors"
//                 >
//                   <div className="p-2 bg-indigo-500/10 rounded-lg mr-4 mt-1 border border-indigo-500/20">
//                     <FiClock className="text-indigo-400 text-lg" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between">
//                       <p className="font-medium text-slate-200">{entry.title}</p>
//                       <span className="text-sm font-medium text-blue-400">
//                         {entry.hours}h
//                       </span>
//                     </div>
//                     <p className="text-sm text-slate-400 mb-1">
//                       {projects.find((p) => p.id === entry.project)?.name}
//                     </p>
//                     <p className="text-xs text-slate-500">{entry.date}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardView;
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
  FiMail,
} from "react-icons/fi";
import { FaEnvelopeOpen } from "react-icons/fa";
import notificationService, { type Notification } from "../../services/notificationService";
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

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
        // Add the new notification to the list if it's included in the payload
        if (data.notification) {
          setNotifications((prev) => [data.notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        } else {
          // Fallback if notification object isn't sent (shouldn't happen with updated backend)
          fetchNotifications();
        }
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
    // THEME CONTAINER
    <div className="space-y-6 container px-4 py-6">

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400">Welcome back, <span className="text-blue-400">{employee.name}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="p-2.5 rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
              }}
            >
              <FiBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900 animate-pulse">
                </span>
              )}
            </button>

            {/* Notification Dropdown - Dark Theme */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 z-50 max-h-96 overflow-y-auto backdrop-blur-md">
                <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className={`text-xs font-medium transition-colors ${unreadCount > 0
                      ? "text-blue-400 hover:text-blue-300 cursor-pointer"
                      : "text-slate-600 cursor-not-allowed"
                      }`}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="divide-y divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`p-3 hover:bg-slate-800/50 transition-colors flex items-start gap-3 ${!notif.isRead ? "bg-blue-900/10" : ""
                          }`}
                      >
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={notif.isRead}
                            onChange={(e) => {
                              if (e.target.checked && !notif.isRead) {
                                handleMarkAsRead(notif._id);
                              }
                            }}
                            className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/50 cursor-pointer"
                            disabled={notif.isRead}
                          />
                          {notif.isRead ? (
                            <FaEnvelopeOpen className="text-slate-600" />
                          ) : (
                            <FiMail className="text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${!notif.isRead
                              ? "font-semibold text-slate-200"
                              : "text-slate-500"
                              }`}
                          >
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 p-5 rounded-xl shadow-xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/10 rounded-lg mr-4 border border-blue-500/20">
              <FiBriefcase className="text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {projects.length}
              </h3>
              <p className="text-slate-400 text-sm">Active Projects</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-emerald-400 text-sm flex items-center">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              {projects.filter((p) => p.status === "active").length} ongoing
            </p>
          </div>
        </div>

        {/* Hours Logged Card - Updated with Weeks/Months conversion */}
        <div className="bg-slate-900/80 p-5 rounded-xl shadow-xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500/10 rounded-lg mr-4 border border-purple-500/20">
              <FiClock className="text-purple-400 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {totalHours.toFixed(1)}
              </h3>
              <p className="text-slate-400 text-sm">Hours Logged</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between">
            <div className="flex flex-col">
              <span className="text-white font-semibold">{(totalHours / 40).toFixed(1)}</span>
              <span className="text-slate-500 text-xs">Weeks</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-white font-semibold">{(totalHours / 160).toFixed(1)}</span>
              <span className="text-slate-500 text-xs">Months</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl shadow-xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center">
            <div className="p-3 bg-amber-500/10 rounded-lg mr-4 border border-amber-500/20">
              <FiBarChart2 className="text-amber-400 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {tasks.length}
              </h3>
              <p className="text-slate-400 text-sm">Assigned Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl shadow-xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-500/10 rounded-lg mr-4 border border-emerald-500/20">
              <FiUser className="text-emerald-400 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {employee.role ? employee.role.replace("_", " ").charAt(0).toUpperCase() + employee.role.slice(1).replace("_", " ") : "N/A"}
              </h3>
              <p className="text-slate-400 text-sm">Your Role</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-slate-400 text-sm">
              Team lead on{" "}
              <span className="font-medium text-white">
                {teamLeadProjectsCount} projects
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Projects List */}
        <div className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              My Projects
            </h2>
            <button
              className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
              onClick={() => setActiveView("projects")}
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-800">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No projects found.</div>
            ) : (
              projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex justify-between items-center p-5 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg mr-4 border ${project.status === "active"
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
                    <div>
                      <h3 className="font-medium text-slate-200">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {typeof project.client === "string"
                          ? project.client
                          : project.client?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border ${project.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : project.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Time Entries */}
        <div className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              Recent Time Entries
            </h2>
            <button
              className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
              onClick={() => setActiveView("timesheets")}
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-800">
            {timeEntries.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No time entries recorded.</div>
            ) : (
              timeEntries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start p-5 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="p-2 bg-indigo-500/10 rounded-lg mr-4 mt-1 border border-indigo-500/20">
                    <FiClock className="text-indigo-400 text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-slate-200">{entry.title}</p>
                      <span className="text-sm font-medium text-blue-400">
                        {entry.hours}h
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-1">
                      {projects.find((p) => p.id === entry.project)?.name}
                    </p>
                    <p className="text-xs text-slate-500">{entry.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;