
// import React, { useEffect, useState } from "react";
// import {
//   FiHome,
//   FiBriefcase,
//   FiUsers,
//   FiUser,
//   FiSettings,
//   FiBell,
//   FiSearch,
//   FiPlus,
//   FiMenu,
//   FiX,
//   FiLogOut,
//   FiClock,
// } from "react-icons/fi";

// import AddEntityModal from "../../components/AddEntity/AddEntityModal";
// import AddTaskModal from "../../components/AddTask/AddTask";
// import ProjectTimesheetView from "../../components/ProjectTimeSheetView/ProjectTimeSheet";
// import ProjectsView from "../../components/Projects/Projects";
// import ClientsView from "../../components/clients/Clients";
// import EmployeesView from "../../components/employees/Employee";
// import Settings from "../../components/Setting/Setting";
// import { useGetClients, useAddClient } from "../../hooks/useClient";
// import { useGetProjects, useAddProject, useUpdateProject } from "../../hooks/useProject";
// import {
//   useEmployees,
//   useCreateUser,
//   useUpdateUser,
// } from "../../hooks/useEmployee";
// import { useManagerDashboardStats } from "../../hooks/useManager";
// import { useAuthLogout } from "../../hooks/useAuth";
// import { useCreateTask, useUpdateTask } from "../../hooks/useTask";
// import type { Client, Project, User, TimeEntry } from "../../types/index";
// import type { Task } from "../../types/task";
// import { useAuthStore } from "../../store/authStore";
// import { useNavigate } from "react-router-dom";

// interface EntityConfig {
//   type: "client" | "project" | "employee" | "deliverable";
//   title: string;
//   fields: any[];
//   onSubmit: (data: any ) => void;
//   initialData?: any;
// }
// const ManagerDashboard: React.FC = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeView,setActiveView] = useState("dashboard");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [modalConfig, setModalConfig] = useState<EntityConfig | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [showAddTaskModal, setShowAddTaskModal] = useState(false);
//   const [selectedProjectForTask, setSelectedProjectForTask] = useState<Project | null>(null);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const { user, isAuthenticated } = useAuthStore();
//   const navigate = useNavigate();
//   const { mutate: logout } = useAuthLogout();

//   // Fetch data
//   const { data: clientsData = [], isLoading: clientsLoading } = useGetClients();
//   const { data: projectsData, isLoading: projectsLoading } = useGetProjects();
//   useEffect(() => {
//     console.log("Projects data:", projectsData);
//   }, [projectsData]);
//   const { data: employeesData, isLoading: employeesLoading } = useEmployees();
//   const { data: statsData, isLoading: statsLoading } =
//     useManagerDashboardStats();
//   const { mutate: addClient } = useAddClient();
//   const { mutate: addProject } = useAddProject();
//   const { mutate: updateProject } = useUpdateProject();
//   const { mutate: createUser } = useCreateUser();
//   const { mutate: updateUser } = useUpdateUser();
//   const { mutate: createTask } = useCreateTask();
//   const { mutate: updateTask } = useUpdateTask();

//   const clients = clientsData as Client[];
//   const employees = (employeesData?.users || []) as User[];
//   const stats = statsData || {
//     projects: 0,
//     clients: 0,
//     employees: 0,
//   };
//   const projects = projectsData?.projects || [];
//   const pagination = projectsData?.pagination || {
//     currentPage: 1,
//     totalPages: 1,
//     totalProjects: 0,
//     hasNextPage: false,
//     hasPrevPage: false,
//   };
//   // Navigation items
//   const navItems = [
//     { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
//     { id: "projects", label: "Projects", icon: <FiBriefcase /> },
//     { id: "clients", label: "Clients", icon: <FiUsers /> },
//     { id: "employees", label: "Employees", icon: <FiUser /> },
//     { id: "settings", label: "Settings", icon: <FiSettings /> },
//   ];

//   // Modal configs
//   const projectConfig: EntityConfig = {
//     type: "project",
//     title: "Project",
//     fields: [
//       {
//         name: "name",
//         label: "Project Name",
//         type: "text",
//         placeholder: "Enter project name",
//         required: true,
//       },
//       {
//         name: "client",
//         label: "Client",
//         type: "select",
//         placeholder: "Select client",
//         options: clients.map((client) => ({
//           value: client._1,
//           label: client.name,
//         })),
//         required: true,
//       },
//       {
//         name: "status",
//         label: "Status",
//         type: "select",
//         placeholder: "Select status",
//         options: ["active", "pending", "completed"].map((status) => ({
//           value: status,
//           label: status.charAt(0).toUpperCase() + status.slice(1),
//         })),
//         required: true,
//       },
//       {
//         name: "startDate",
//         label: "Start Date",
//         type: "date",
//         placeholder: "YYYY-MM-DD",
//         required: true,
//       },
//       {
//         name: "estimatedTime",
//         label: "Estimated Time",
//         type: "text",
//         placeholder: "e.g., 3 months",
//         required: true,
//       },
//       {
//         name: "teamLead",
//         label: "Team Lead",
//         type: "select",
//         placeholder: "Select team lead",
//         options: employees.map((employee) => ({
//           value: employee._id,
//           label: employee.name,
//         })),
//         required: true,
//       },
//       {
//         name: "teamMembers",
//         label: "Team Members",
//         type: "select",
//         placeholder: "Select team members",
//         options: employees.map((employee) => ({
//           value: employee._id,
//           label: employee.name,
//         })),
//         multiple: true,
//         required: false,
//       },
//     ],
//     onSubmit: (data) => {
//       addProject(
//         {
//           ...data,
//           teamMembers: data.teamMembers || [],
//         },
//         {
//           onSuccess: () => {
//             setShowAddModal(false);
//             setModalConfig(null);
//             setErrorMessage(null);
//           },
//           onError: (error: any) => {
//             setErrorMessage(
//               error.response?.data?.error || "Failed to add project"
//             );
//           },
//         }
//       );
//     },
//   };

//   // ... other configs (clientConfig, employeeConfig) remain unchanged ...
//   // (unchanged code elided in this snippet for brevity — keep your original clientConfig/employeeConfig here)

//   // Open add/edit modal
//   const openAddModal = (
//     type: "project" | "client" | "employee",
//     initialData?: any
//   ) => {
//     let config;
//     if (type === "project") {
//       config = {
//         ...projectConfig,
//         title: initialData && initialData._id ? "Edit Project" : "Add Project",
//         initialData,
//         onSubmit: (data: any) => {
//           if (initialData && initialData._id) {
//             // Edit mode - use updateProject
//             updateProject(
//               { id: initialData._id, data: { ...data, teamMembers: data.teamMembers || [] } },
//               {
//                 onSuccess: () => {
//                   setShowAddModal(false);
//                   setModalConfig(null);
//                   setErrorMessage(null);
//                 },
//                 onError: (error: any) => {
//                   setErrorMessage(
//                     error.response?.data?.error || "Failed to update project"
//                   );
//                 },
//               }
//             );
//           } else {
//             // Create mode - use addProject
//             addProject(
//               { ...data, teamMembers: data.teamMembers || [] },
//               {
//                 onSuccess: () => {
//                   setShowAddModal(false);
//                   setModalConfig(null);
//                   setErrorMessage(null);
//                 },
//                 onError: (error: any) => {
//                   setErrorMessage(
//                     error.response?.data?.error || "Failed to add project"
//                   );
//                 },
//               }
//             );
//           }
//         },
//       };
//     } else if (type === "client") {
//       // set client config...
//       config = { /*...clientConfig*/ } as any;
//     } else {
//       // set employee config...
//       config = { /*...employeeConfig*/ } as any;
//     }
    
//     setModalConfig(config);
//     setShowAddModal(true);
//     setErrorMessage(null);
//   };

//   // Handle edit
//   const handleEditProject = (id: string, data: Partial<Project>) => {
//     openAddModal("project", {
//       _id: id,
//       ...data,
//       teamMembers: data.teamMembers || [],
//     });
//   };

//   const handleEditClient = (client: Client) => {
//     openAddModal("client", client);
//   };

//   // Handle add task
//   const handleAddTask = (data: {
//     title: string;
//     description?: string;
//     project: string;
//     assignedTo?: string;
//     priority: "urgent" | "high" | "medium" | "low";
//     status: "todo" | "in_progress" | "done";
//     dueDate?: string;
//     isSubtask?: boolean;
//     parentTaskId?: string;
//   }) => {
//     const taskData: Omit<Task, "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"> = {
//       title: data.title,
//       description: data.description,
//       priority: data.priority,
//       status: data.status,
//       dueDate: data.dueDate,
//       assignedTo: data.assignedTo || "",
//       subtasks: [],
//     };
    
//     createTask(
//       { projectId: data.project, data: taskData },
//       {
//         onSuccess: () => {
//           setShowAddTaskModal(false);
//           setSelectedProjectForTask(null);
//         },
//         onError: (error: any) => {
//           setErrorMessage(
//             error.response?.data?.error || "Failed to create task"
//           );
//         },
//       }
//     );
//   };

//   // Handle edit task
//   const handleEditTask = (data: {
//     title: string;
//     description?: string;
//     project: string;
//     assignedTo?: string;
//     priority: "urgent" | "high" | "medium" | "low";
//     status: "todo" | "in_progress" | "done";
//     dueDate?: string;
//     isSubtask?: boolean;
//     parentTaskId?: string;
//   }) => {
//     if (!editingTask) return;

//     const taskData: Partial<Task> = {
//       title: data.title,
//       description: data.description,
//       priority: data.priority,
//       status: data.status,
//       dueDate: data.dueDate,
//       assignedTo: data.assignedTo || "",
//     };
    
//     updateTask(
//       { projectId: data.project, taskId: editingTask._id, data: taskData },
//       {
//         onSuccess: () => {
//           setShowAddTaskModal(false);
//           setSelectedProjectForTask(null);
//           setEditingTask(null);
//         },
//         onError: (error: any) => {
//           setErrorMessage(
//             error.response?.data?.error || "Failed to update task"
//           );
//         },
//       }
//     );
//   };

//   // Open task editing modal
//   const openEditTaskModal = (task: Task) => {
//     setEditingTask(task);
//     setShowAddTaskModal(true);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     logout();
//   };

//   // Handler to open Add Task modal from Dashboard
//   const openAddTaskFromDashboard = () => {
//     setSelectedProjectForTask(null); // no pre-selected project
//     setShowAddTaskModal(true);
//   };

//   // Render main content
//   const renderMainContent = () => {
//     if (clientsLoading || projectsLoading || employeesLoading || statsLoading) {
//       return <div className="p-6">Loading...</div>;
//     }

//     if (activeView.startsWith("timesheet-")) {
//       const projectId = activeView.split("timesheet-")[1];
//       const project = projects.find((p) => p._id === projectId);
//       if (!project) {
//         return (
//           <div className="p-6 bg-card rounded-xl shadow-lg">
//             <h1 className="text-2xl font-bold text-foreground">
//               Project not found
//             </h1>
//             <button
//               onClick={() => setActiveView("projects")}
//               className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
//             >
//               Back to Projects
//             </button>
//           </div>
//         );
//       }
//       return (
//         <ProjectTimesheetView
//           project={{ _id: project._id, name: project.name }}
//           timeEntries={[]} // TODO: Replace with useGetTimeEntries
//           onAddDeliverable={(deliverable) =>
//             console.log("Add deliverable:", deliverable)
//           }
//         />
//       );
//     }

//     switch (activeView) {
//       case "dashboard":
//         return (
//           <DashboardView
//             projects={projects}
//             clients={clients}
//             timeEntries={[]}
//             stats={stats}
//             onAddProject={() => openAddModal("project")}
//             onAddClient={() => openAddModal("client")}
//             setActiveView={setActiveView}
//             onAddTask={openAddTaskFromDashboard} // <-- pass handler to dashboard
//           />
//         );
//       case "projects":
//         function setCurrentPage(page: number): void {
//           throw new Error("Function not implemented.");
//         }

//         return (
//           <ProjectsView
//             projects={projects}
//             pagination={pagination}
//             onEditProject={handleEditProject}
//             timeEntries={[]}
//             onAddDeliverable={(deliverable) =>
//               console.log("Add deliverable:", deliverable)
//             }
//             setActiveView={setActiveView}
//             onPageChange={setCurrentPage} // Pass page change handler
//             onAddTask={(project) => {
//               setSelectedProjectForTask(project || null);
//               setShowAddTaskModal(true);
//             }}
//             onEditTask={openEditTaskModal} // Added onEditTask prop
//           />
//         );
//       case "clients":
//         return (
//           <ClientsView clients={clients} onEditClient={handleEditClient} />
//         );
//       case "employees":
//         return (
//           <EmployeesView
//             employees={employees}
//             projects={projects} // Pass projects to EmployeesView
//           />
//         );
//       case "settings":
//         return <Settings />;
//       default:
//         return (
//           <DashboardView
//             projects={projects}
//             clients={clients}
//             employees={employees}
//             timeEntries={[]}
//             stats={stats}
//             onAddProject={() => openAddModal("project")}
//             onAddClient={() => openAddModal("client")}
//             onEditProject={handleEditProject}
//             setActiveView={setActiveView}
//             onAddTask={openAddTaskFromDashboard} // also pass here
//           />
//         );
//     }
//   };

//   if (!isAuthenticated) {
//     navigate("/login");
//     return null;
//   }

//   return (
//     <div className="dashboard-container">
//       {errorMessage && (
//         <div className="fixed top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg flex items-center">
//           <FiX className="mr-2" />
//           {errorMessage}
//           <button
//             onClick={() => setErrorMessage(null)}
//             className="ml-4 text-destructive-foreground hover:text-white"
//           >
//             <FiX size={16} />
//           </button>
//         </div>
//       )}
//       <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
//         <div className="sidebar-header">
//           <div className="logo">
//             <FiBriefcase className="logo-icon" />
//             <span>ProjectFlow</span>
//           </div>
//           <button
//             className="sidebar-close"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <FiX />
//           </button>
//         </div>
//         <nav className="sidebar-nav">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               className={`nav-item ${activeView === item.id ? "active" : ""}`}
//               onClick={() => setActiveView(item.id)}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>
//       <div className="main-content">
//         <div className="top-nav">
//           <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
//             <FiMenu />
//           </button>
//           <div className="search-box">
//             <FiSearch className="search-icon" />
//             <input type="text" placeholder="Search..." />
//           </div>
//           <div className="user-menu">
//             <div className="notifications">
//               <FiBell />
//               <span className="notification-badge">3</span>
//             </div>
//             <div className="user-profile">
//               <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
//               <div className="user-info">
//                 <div className="user-name">{user?.name || "User"}</div>
//                 <div className="user-role">
//                   {user?.role.replace("_", " ").toUpperCase()}
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-muted-foreground hover:text-foreground"
//               >
//                 <FiLogOut className="mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="content-area">{renderMainContent()}</div>
//       </div>
//       {showAddModal && modalConfig && (
//         <AddEntityModal
//           config={modalConfig}
//           onClose={() => {
//             setShowAddModal(false);
//             setModalConfig(null);
//             setErrorMessage(null);
//           }}
//         />
//       )}
//       {showAddTaskModal && (
//         <AddTaskModal
//           projects={projects}
//           selectedProject={selectedProjectForTask || undefined}
//           editingTask={editingTask}
//           employee={
//             user || {
//               _id: "",
//               name: "",
//               role: "manager",
//               email: "",
//               phone: "",
//               grade: 0,
//               designation: "",
//               cnic: "",
//               projects: [],
//             }
//           }
//           onSubmit={editingTask ? handleEditTask : handleAddTask}
//           onClose={() => {
//             setShowAddTaskModal(false);
//             setSelectedProjectForTask(null);
//             setEditingTask(null);
//           }}
//           tasks={[]}
//         />
//       )}
//     </div>
//   );
// };

// interface DashboardViewProps {
//   projects: Project[];
//   clients: Client[];
//   timeEntries: TimeEntry[];
//   stats: {
//     projects: number;
//     clients: number;
//     employees: number;
//   };
//   onAddProject: () => void;
//   onAddClient: () => void;
//   setActiveView: (view: string) => void;
//   onAddTask?: () => void; // <-- added prop
// }

// const DashboardView: React.FC<DashboardViewProps> = ({
//   projects,
//   clients,
//   timeEntries,
//   stats,
//   onAddProject,
//   onAddClient,
//   setActiveView,
//   onAddTask,
// }) => {
//   return (
//     <div className="dashboard-view">
//       <div className="page-header">
//         <h1>Dashboard Overview</h1>
//         <div className="header-actions">
//           {/* Add Task button moved here and wired to onAddTask prop */}
//           <button onClick={() => onAddTask && onAddTask()} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2" aria-label="Add task">Add Task</button>
//           <button className="btn btn-primary" onClick={onAddProject}>
//             <FiPlus /> Add Project
//           </button>
//           <button className="btn btn-secondary" onClick={onAddClient}>
//             <FiPlus /> Add Client
//           </button>
//         </div>
//       </div>
//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-icon projects">
//             <FiBriefcase />
//           </div>
//           <div className="stat-info">
//             <h3>{stats.projects}</h3>
//             <p>Active Projects</p>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon clients">
//             <FiUsers />
//           </div>
//           <div className="stat-info">
//             <h3>{stats.clients}</h3>
//             <p>Clients</p>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon employees">
//             <FiUser />
//           </div>
//           <div className="stat-info">
//             <h3>{stats.employees}</h3>
//             <p>Employees</p>
//           </div>
//         </div>
//       </div>
//       <div className="dashboard-content-grid">
//         <div className="content-column">
//           <div className="card">
//             <div className="card-header">
//               <h2>Recent Projects</h2>
//             </div>
//             <div className="card-content">
//               {projects.slice(0, 3).map((project) => (
//                 <div
//                   key={project._id}
//                   className="list-item cursor-pointer hover:bg-muted/50"
//                   onClick={() => setActiveView("projects")}
//                 >
//                   <div className="item-info">
//                     <h4>{project.name}</h4>
//                     <p>
//                       Client:{" "}
//                       {typeof project.client === "string"
//                         ? project.client
//                         : project.client.name}
//                     </p>
//                   </div>
//                   <span className={`status-badge status-${project.status}`}>
//                     {project.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="content-column">
//           <div className="card">
//             <div className="card-header">
//               <h2>Clients</h2>
//             </div>
//             <div className="card-content">
//               {clients.slice(0, 3).map((client) => (
//                 <div key={client._id} className="list-item">
//                   <div className="item-info">
//                     <h4>{client.name}</h4>
//                     <p>{client.projects.length} projects</p>
//                   </div>
//                   <span className="status-badge status-active">Active</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="card">
//         <div className="card-header">
//           <h2>Recent Time Entries</h2>
//         </div>
//         <div className="card-content">
//           {timeEntries.slice(0, 5).map((entry) => (
//             <div key={entry._id} className="activity-item">
//               <div className="activity-icon">
//                 <FiClock />
//               </div>
//               <div className="activity-content">
//                 <p>
//                   <strong>{entry.employee}</strong> logged {entry.hours} hours
//                   on <strong>{entry.project}</strong>
//                 </p>
//                 <p className="activity-description">{entry.description}</p>
//                 <span className="activity-time">{entry.date}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;
import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiUser,
  FiSettings,
  FiBell,
  FiSearch,
  FiPlus,
  FiMenu,
  FiX,
  FiLogOut,
  FiClock,
} from "react-icons/fi";

import AddEntityModal from "../../components/AddEntity/AddEntityModal";
import AddTaskModal from "../../components/AddTask/AddTask";
import ProjectTimesheetView from "../../components/ProjectTimeSheetView/ProjectTimeSheet";
import ProjectsView from "../../components/Projects/Projects";
import ClientsView from "../../components/clients/Clients";
import EmployeesView from "../../components/employees/Employee";
import Settings from "../../components/Setting/Setting";
import { useGetClients, useAddClient } from "../../hooks/useClient";
import { useGetProjects, useAddProject, useUpdateProject } from "../../hooks/useProject";
import {
  useEmployees,
  useCreateUser,
  useUpdateUser,
} from "../../hooks/useEmployee";
import { useManagerDashboardStats } from "../../hooks/useManager";
import { useAuthLogout } from "../../hooks/useAuth";
import { useCreateTask, useUpdateTask, useGetTasks } from "../../hooks/useTask";
import type { Client, Project, User, TimeEntry } from "../../types/index";
import type { Task } from "../../types/task";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

interface EntityConfig {
  type: "client" | "project" | "employee" | "deliverable";
  title: string;
  fields: any[];
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ManagerDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<EntityConfig | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: logout } = useAuthLogout();

  // Fetch data
  const { data: clientsData = [], isLoading: clientsLoading } = useGetClients();
  const { data: projectsData, isLoading: projectsLoading } = useGetProjects();
  const { data: employeesData, isLoading: employeesLoading } = useEmployees();
  const { data: statsData, isLoading: statsLoading } = useManagerDashboardStats();
  
  // FIXED: Fetch tasks for the selected project
  const selectedProjectId = selectedProjectForTask?._id || selectedProjectForTask?.id;
  const { data: tasksData = [], isLoading: tasksLoading } = useGetTasks(selectedProjectId);

  const { mutate: addClient } = useAddClient();
  const { mutate: addProject } = useAddProject();
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();

  const clients = clientsData as Client[];
  const employees = (employeesData?.users || []) as User[];
  const stats = statsData || {
    projects: 0,
    clients: 0,
    employees: 0,
  };
  const projects = projectsData?.projects || [];
  const pagination = projectsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  useEffect(() => {
    console.log("Projects data:", projectsData);
  }, [projectsData]);

  // Debug log for tasks
  useEffect(() => {
    console.log("Tasks data for project:", {
      projectId: selectedProjectId,
      tasks: tasksData,
      count: tasksData?.length || 0,
    });
  }, [selectedProjectId, tasksData]);

  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "projects", label: "Projects", icon: <FiBriefcase /> },
    { id: "clients", label: "Clients", icon: <FiUsers /> },
    { id: "employees", label: "Employees", icon: <FiUser /> },
    { id: "settings", label: "Settings", icon: <FiSettings /> },
  ];

  // Modal configs
  const projectConfig: EntityConfig = {
    type: "project",
    title: "Project",
    fields: [
      {
        name: "name",
        label: "Project Name",
        type: "text",
        placeholder: "Enter project name",
        required: true,
      },
      {
        name: "client",
        label: "Client",
        type: "select",
        placeholder: "Select client",
        options: clients.map((client) => ({
          value: client._id,
          label: client.name,
        })),
        required: true,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        placeholder: "Select status",
        options: ["active", "pending", "completed"].map((status) => ({
          value: status,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        })),
        required: true,
      },
      {
        name: "startDate",
        label: "Start Date",
        type: "date",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
      {
        name: "estimatedTime",
        label: "Estimated Time",
        type: "text",
        placeholder: "e.g., 3 months",
        required: true,
      },
      {
        name: "teamLead",
        label: "Team Lead",
        type: "select",
        placeholder: "Select team lead",
        options: employees.map((employee) => ({
          value: employee._id,
          label: employee.name,
        })),
        required: true,
      },
      {
        name: "teamMembers",
        label: "Team Members",
        type: "select",
        placeholder: "Select team members",
        options: employees.map((employee) => ({
          value: employee._id,
          label: employee.name,
        })),
        multiple: true,
        required: false,
      },
    ],
    onSubmit: (data) => {
      addProject(
        {
          ...data,
          teamMembers: data.teamMembers || [],
        },
        {
          onSuccess: () => {
            setShowAddModal(false);
            setModalConfig(null);
            setErrorMessage(null);
          },
          onError: (error: any) => {
            setErrorMessage(
              error.response?.data?.error || "Failed to add project"
            );
          },
        }
      );
    },
  };

  // Open add/edit modal
  const openAddModal = (
    type: "project" | "client" | "employee",
    initialData?: any
  ) => {
    let config;
    if (type === "project") {
      config = {
        ...projectConfig,
        title: initialData && initialData._id ? "Edit Project" : "Add Project",
        initialData,
        onSubmit: (data: any) => {
          if (initialData && initialData._id) {
            updateProject(
              { id: initialData._id, data: { ...data, teamMembers: data.teamMembers || [] } },
              {
                onSuccess: () => {
                  setShowAddModal(false);
                  setModalConfig(null);
                  setErrorMessage(null);
                },
                onError: (error: any) => {
                  setErrorMessage(
                    error.response?.data?.error || "Failed to update project"
                  );
                },
              }
            );
          } else {
            addProject(
              { ...data, teamMembers: data.teamMembers || [] },
              {
                onSuccess: () => {
                  setShowAddModal(false);
                  setModalConfig(null);
                  setErrorMessage(null);
                },
                onError: (error: any) => {
                  setErrorMessage(
                    error.response?.data?.error || "Failed to add project"
                  );
                },
              }
            );
          }
        },
      };
    } else if (type === "client") {
      config = {} as any; // Add your client config
    } else {
      config = {} as any; // Add your employee config
    }
    
    setModalConfig(config);
    setShowAddModal(true);
    setErrorMessage(null);
  };

  // Handle edit
  const handleEditProject = (id: string, data: Partial<Project>) => {
    openAddModal("project", {
      _id: id,
      ...data,
      teamMembers: data.teamMembers || [],
    });
  };

  const handleEditClient = (client: Client) => {
    openAddModal("client", client);
  };

  // Handle add task
  const handleAddTask = (data: {
    title: string;
    description?: string;
    project: string;
    assignedTo?: string;
    priority: "urgent" | "high" | "medium" | "low";
    status: "todo" | "in_progress" | "done";
    dueDate?: string;
    isSubtask?: boolean;
    parentTaskId?: string;
  }) => {
    const taskData: Omit<Task, "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"> = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate,
      assignedTo: data.assignedTo || "",
      subtasks: [],
    };
    
    createTask(
      { projectId: data.project, data: taskData },
      {
        onSuccess: () => {
          setShowAddTaskModal(false);
          setSelectedProjectForTask(null);
        },
        onError: (error: any) => {
          setErrorMessage(
            error.response?.data?.error || "Failed to create task"
          );
        },
      }
    );
  };

  // Handle edit task
  const handleEditTask = (data: {
    title: string;
    description?: string;
    project: string;
    assignedTo?: string;
    priority: "urgent" | "high" | "medium" | "low";
    status: "todo" | "in_progress" | "done";
    dueDate?: string;
    isSubtask?: boolean;
    parentTaskId?: string;
  }) => {
    if (!editingTask) return;

    const taskData: Partial<Task> = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate,
      assignedTo: data.assignedTo || "",
    };
    
    updateTask(
      { projectId: data.project, taskId: editingTask._id, data: taskData },
      {
        onSuccess: () => {
          setShowAddTaskModal(false);
          setSelectedProjectForTask(null);
          setEditingTask(null);
        },
        onError: (error: any) => {
          setErrorMessage(
            error.response?.data?.error || "Failed to update task"
          );
        },
      }
    );
  };

  // Open task editing modal
  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    // Set the project for fetching tasks
    const taskProject = projects.find(p => 
      p._id === (typeof task.project === 'string' ? task.project : task.project._id)
    );
    if (taskProject) {
      setSelectedProjectForTask(taskProject);
    }
    setShowAddTaskModal(true);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Handler to open Add Task modal from Dashboard
  const openAddTaskFromDashboard = () => {
    setSelectedProjectForTask(null);
    setShowAddTaskModal(true);
  };

  // Render main content
  const renderMainContent = () => {
    if (clientsLoading || projectsLoading || employeesLoading || statsLoading) {
      return <div className="p-6">Loading...</div>;
    }

    if (activeView.startsWith("timesheet-")) {
      const projectId = activeView.split("timesheet-")[1];
      const project = projects.find((p) => p._id === projectId);
      if (!project) {
        return (
          <div className="p-6 bg-card rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-foreground">
              Project not found
            </h1>
            <button
              onClick={() => setActiveView("projects")}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Back to Projects
            </button>
          </div>
        );
      }
      return (
        <ProjectTimesheetView
          project={{ _id: project._id, name: project.name }}
          timeEntries={[]}
          onAddDeliverable={(deliverable) =>
            console.log("Add deliverable:", deliverable)
          }
        />
      );
    }

    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            projects={projects}
            clients={clients}
            timeEntries={[]}
            stats={stats}
            onAddProject={() => openAddModal("project")}
            onAddClient={() => openAddModal("client")}
            setActiveView={setActiveView}
            onAddTask={openAddTaskFromDashboard}
          />
        );
      case "projects":
        return (
          <ProjectsView
            projects={projects}
            pagination={pagination}
            onEditProject={handleEditProject}
            timeEntries={[]}
            onAddDeliverable={(deliverable) =>
              console.log("Add deliverable:", deliverable)
            }
            setActiveView={setActiveView}
            onPageChange={(page) => console.log("Page:", page)}
            onAddTask={(project) => {
              setSelectedProjectForTask(project || null);
              setShowAddTaskModal(true);
            }}
            onEditTask={openEditTaskModal}
          />
        );
      case "clients":
        return (
          <ClientsView clients={clients} onEditClient={handleEditClient} />
        );
      case "employees":
        return (
          <EmployeesView
            employees={employees}
            projects={projects}
          />
        );
      case "settings":
        return <Settings />;
      default:
        return (
          <DashboardView
            projects={projects}
            clients={clients}
            employees={employees}
            timeEntries={[]}
            stats={stats}
            onAddProject={() => openAddModal("project")}
            onAddClient={() => openAddModal("client")}
            onEditProject={handleEditProject}
            setActiveView={setActiveView}
            onAddTask={openAddTaskFromDashboard}
          />
        );
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="dashboard-container">
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg flex items-center z-50">
          <FiX className="mr-2" />
          {errorMessage}
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-4 text-destructive-foreground hover:text-white"
          >
            <FiX size={16} />
          </button>
        </div>
      )}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FiBriefcase className="logo-icon" />
            <span>ProjectFlow</span>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => setActiveView(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="main-content">
        <div className="top-nav">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-menu">
            <div className="notifications">
              <FiBell />
              <span className="notification-badge">3</span>
            </div>
            <div className="user-profile">
              <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
              <div className="user-info">
                <div className="user-name">{user?.name || "User"}</div>
                <div className="user-role">
                  {user?.role.replace("_", " ").toUpperCase()}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="content-area">{renderMainContent()}</div>
      </div>
      {showAddModal && modalConfig && (
        <AddEntityModal
          config={modalConfig}
          onClose={() => {
            setShowAddModal(false);
            setModalConfig(null);
            setErrorMessage(null);
          }}
        />
      )}
      {showAddTaskModal && (
        <AddTaskModal
          projects={projects}
          selectedProject={selectedProjectForTask || undefined}
          editingTask={editingTask}
          employee={
            user || {
              _id: "",
              name: "",
              role: "manager",
              email: "",
              phone: "",
              grade: 0,
              designation: "",
              cnic: "",
              projects: [],
            }
          }
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onClose={() => {
            setShowAddTaskModal(false);
            setSelectedProjectForTask(null);
            setEditingTask(null);
          }}
          // FIXED: Pass actual tasks instead of empty array
          tasks={tasksData as Task[]}
        />
      )}
    </div>
  );
};

interface DashboardViewProps {
  projects: Project[];
  clients: Client[];
  timeEntries: TimeEntry[];
  stats: {
    projects: number;
    clients: number;
    employees: number;
  };
  onAddProject: () => void;
  onAddClient: () => void;
  setActiveView: (view: string) => void;
  onAddTask?: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  clients,
  timeEntries,
  stats,
  onAddProject,
  onAddClient,
  setActiveView,
  onAddTask,
}) => {
  return (
    <div className="dashboard-view">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <div className="header-actions">
          <button 
            onClick={() => onAddTask && onAddTask()} 
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2" 
            aria-label="Add task"
          >
            <FiPlus /> Add Task
          </button>
          <button className="btn btn-primary" onClick={onAddProject}>
            <FiPlus /> Add Project
          </button>
          <button className="btn btn-secondary" onClick={onAddClient}>
            <FiPlus /> Add Client
          </button>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon projects">
            <FiBriefcase />
          </div>
          <div className="stat-info">
            <h3>{stats.projects}</h3>
            <p>Active Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon clients">
            <FiUsers />
          </div>
          <div className="stat-info">
            <h3>{stats.clients}</h3>
            <p>Clients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon employees">
            <FiUser />
          </div>
          <div className="stat-info">
            <h3>{stats.employees}</h3>
            <p>Employees</p>
          </div>
        </div>
      </div>
      <div className="dashboard-content-grid">
        <div className="content-column">
          <div className="card">
            <div className="card-header">
              <h2>Recent Projects</h2>
            </div>
            <div className="card-content">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project._id}
                  className="list-item cursor-pointer hover:bg-muted/50"
                  onClick={() => setActiveView("projects")}
                >
                  <div className="item-info">
                    <h4>{project.name}</h4>
                    <p>
                      Client:{" "}
                      {typeof project.client === "string"
                        ? project.client
                        : project.client.name}
                    </p>
                  </div>
                  <span className={`status-badge status-${project.status}`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="content-column">
          <div className="card">
            <div className="card-header">
              <h2>Clients</h2>
            </div>
            <div className="card-content">
              {clients.slice(0, 3).map((client) => (
                <div key={client._id} className="list-item">
                  <div className="item-info">
                    <h4>{client.name}</h4>
                    <p>{client.projects.length} projects</p>
                  </div>
                  <span className="status-badge status-active">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h2>Recent Time Entries</h2>
        </div>
        <div className="card-content">
          {timeEntries.slice(0, 5).map((entry) => (
            <div key={entry._id} className="activity-item">
              <div className="activity-icon">
                <FiClock />
              </div>
              <div className="activity-content">
                <p>
                  <strong>{entry.employee}</strong> logged {entry.hours} hours
                  on <strong>{entry.project}</strong>
                </p>
                <p className="activity-description">{entry.description}</p>
                <span className="activity-time">{entry.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;