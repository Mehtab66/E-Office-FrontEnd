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
// // --- 1. IMPORT useUpdateClient ---
// import {
//   useGetClients,
//   useAddClient,
//   useUpdateClient,
// } from "../../hooks/useClient";
// import {
//   useGetProjects,
//   useAddProject,
//   useUpdateProject,
// } from "../../hooks/useProject";
// import {
//   useEmployees,
//   useCreateUser,
//   useUpdateUser,
// } from "../../hooks/useEmployee";
// import { useManagerDashboardStats } from "../../hooks/useManager";
// import { useAuthLogout } from "../../hooks/useAuth";
// import {
//   useCreateTask,
//   useUpdateTask,
//   useGetTasks,
//   useCreateSubtask,
// } from "../../hooks/useTask";
// import type { Client, Project, User, TimeEntry } from "../../types/index";
// import type { Task, Subtask } from "../../types/task";
// import { useAuthStore } from "../../store/authStore";
// import { useNavigate } from "react-router-dom";

// // --- FormField interface to match AddEntityModal ---
// interface FormField {
//   name: string;
//   label: string;
//   type: string;
//   placeholder?: string;
//   required?: boolean;
//   options?: string[] | { value: string; label: string }[];
//   multiple?: boolean;
// }

// interface EntityConfig {
//   type: "client" | "project" | "employee" | "deliverable";
//   title: string;
//   fields: FormField[]; // Use the defined FormField interface
//   onSubmit: (data: any) => void;
//   initialData?: any;
// }

// const ManagerDashboard: React.FC = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeView, setActiveView] = useState("dashboard");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [modalConfig, setModalConfig] = useState<EntityConfig | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [showAddTaskModal, setShowAddTaskModal] = useState(false);
//   const [selectedProjectForTask, setSelectedProjectForTask] =
//     useState<Project | null>(null);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const { user, isAuthenticated } = useAuthStore();
//   const navigate = useNavigate();
//   const { mutate: logout } = useAuthLogout();

//   // Fetch data
//   const { data: clientsData = [], isLoading: clientsLoading } = useGetClients();
//   const { data: projectsData, isLoading: projectsLoading } = useGetProjects();
//   const { data: employeesData, isLoading: employeesLoading } = useEmployees();
//   const { data: statsData, isLoading: statsLoading } = useManagerDashboardStats();

//   const selectedProjectId =
//     selectedProjectForTask?._id || selectedProjectForTask?.id;
//   const { data: tasksData = [], isLoading: tasksLoading } =
//     useGetTasks(selectedProjectId);

//   const { mutate: addClient } = useAddClient();
//   const { mutate: addProject } = useAddProject();
//   const { mutate: updateProject } = useUpdateProject();
//   const { mutate: createUser } = useCreateUser();
//   const { mutate: updateUser } = useUpdateUser();
//   // --- 2. INITIALIZE useUpdateClient ---
//   const { mutate: updateClient } = useUpdateClient();
//   const { mutate: createTask } = useCreateTask();
//   const { mutate: updateTask } = useUpdateTask();
//   const { mutate: createSubtask } = useCreateSubtask();

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

//   useEffect(() => {
//     console.log("Projects data:", projectsData);
//   }, [projectsData]);

//   // Debug log for tasks
//   useEffect(() => {
//     console.log("Tasks data for project:", {
//       projectId: selectedProjectId,
//       tasks: tasksData,
//       count: tasksData?.length || 0,
//     });
//   }, [selectedProjectId, tasksData]);

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
//           value: client._id,
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

//   const clientConfig: EntityConfig = {
//     type: "client",
//     title: "Client",
//     fields: [
//       {
//         name: "name",
//         label: "Client Name",
//         type: "text",
//         placeholder: "Enter client name",
//         required: true,
//       },
//       {
//         name: "email",
//         label: "Email",
//         type: "email",
//         placeholder: "client@example.com",
//         required: true,
//       },
//       {
//         name: "phone",
//         label: "Phone",
//         type: "tel",
//         placeholder: "+1234567890",
//         required: false,
//       },
//       {
//         name: "country",
//         label: "Country",
//         type: "select",
//         placeholder: "Select country",
//         required: false,
//       },
//       {
//         name: "billingAddress",
//         label: "Billing Address",
//         type: "textarea",
//         placeholder: "Enter billing address",
//         required: false,
//       },
//       {
//         name: "shippingAddress",
//         label: "Shipping Address",
//         type: "textarea",
//         placeholder: "Enter shipping address",
//         required: true,
//       },
//     ],
//     onSubmit: (data) => {
//       addClient(
//         {
//           ...data,
//           projects: [],
//         },
//         {
//           onSuccess: () => {
//             setShowAddModal(false);
//             setModalConfig(null);
//             setErrorMessage(null);
//           },
//           onError: (error: any) => {
//             setErrorMessage(error.response?.data?.error || "Failed to add client");
//           },
//         }
//       );
//     },
//   };

//   const employeeConfig: EntityConfig = {
//     type: "employee",
//     title: "Employee",
//     fields: [
//       {
//         name: "name",
//         label: "Full Name",
//         type: "text",
//         placeholder: "Enter full name",
//         required: true,
//       },
//       {
//         name: "email",
//         label: "Email",
//         type: "email",
//         placeholder: "employee@example.com",
//         required: true,
//       },
//       {
//         name: "password",
//         label: "Password",
//         type: "password",
//         placeholder: "Enter password",
//         required: true,
//       },
//       {
//         name: "phone",
//         label: "Phone",
//         type: "tel",
//         placeholder: "+1234567890",
//         required: true,
//       },
//       {
//         name: "designation",
//         label: "Designation",
//         type: "text",
//         placeholder: "e.g., Software Engineer",
//         required: true,
//       },
//       {
//         name: "grade",
//         label: "Grade",
//         type: "number",
//         placeholder: "e.g., 18",
//         required: true,
//       },
//       {
//         name: "cnic",
//         label: "CNIC",
//         type: "text",
//         placeholder: "12345-1234567-1",
//         required: true,
//       },
//       {
//         name: "role",
//         label: "Role",
//         type: "select",
//         placeholder: "Select role",
//         required: true,
//         options: [
//           { value: "employee", label: "Employee" },
//           { value: "manager", label: "Manager" },
//         ],
//       },
//     ],
//     onSubmit: (data) => {
//       createUser(data, {
//         onSuccess: () => {
//           setShowAddModal(false);
//           setModalConfig(null);
//           setErrorMessage(null);
//         },
//         onError: (error: any) => {
//           setErrorMessage(
//             error.response?.data?.error || "Failed to create employee"
//           );
//         },
//       });
//     },
//   };

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
//             updateProject(
//               {
//                 id: initialData._id,
//                 data: { ...data, teamMembers: data.teamMembers || [] },
//               },
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
//             // Use the default onSubmit from projectConfig
//             projectConfig.onSubmit(data);
//           }
//         },
//       };
//     } else if (type === "client") {
//       config = {
//         ...clientConfig,
//         title: initialData && initialData._id ? "Edit Client" : "Add Client",
//         initialData,
//         onSubmit: (data: any) => {
//           // --- 3. IMPLEMENTED THE UPDATE LOGIC ---
//           if (initialData && initialData._id) {
//             // Preserve the projects array from initialData
//             updateClient(
//               {
//                 id: initialData._id,
//                 data: { ...data, projects: initialData.projects || [] },
//               },
//               {
//                 onSuccess: () => {
//                   setShowAddModal(false);
//                   setModalConfig(null);
//                   setErrorMessage(null);
//                 },
//                 onError: (error: any) => {
//                   setErrorMessage(
//                     error.response?.data?.error || "Failed to update client"
//                   );
//                 },
//               }
//             );
//           } else {
//             // Use the default onSubmit from clientConfig for creating
//             clientConfig.onSubmit(data);
//           }
//         },
//       };
//     } else {
//       // 'employee'
//       config = {
//         ...employeeConfig,
//         title: initialData && initialData._id ? "Edit Employee" : "Add Employee",
//         initialData,
//         // When editing, remove the password field (it shouldn't be required)
//         fields:
//           initialData && initialData._id
//             ? employeeConfig.fields
//                 .filter((f) => f.name !== "password")
//                 .map((f) => ({
//                   ...f,
//                   required: f.name === "password" ? false : f.required,
//                 }))
//             : employeeConfig.fields,
//         onSubmit: (data: any) => {
//           if (initialData && initialData._id) {
//             updateUser(
//               { id: initialData._id, data },
//               {
//                 onSuccess: () => {
//                   setShowAddModal(false);
//                   setModalConfig(null);
//                   setErrorMessage(null);
//                 },
//                 onError: (error: any) => {
//                   setErrorMessage(
//                     error.response?.data?.error || "Failed to update employee"
//                   );
//                 },
//               }
//             );
//           } else {
//             // Use the default onSubmit from employeeConfig
//             employeeConfig.onSubmit(data);
//           }
//         },
//       };
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
//     if (data.isSubtask && data.parentTaskId) {
//       const subtaskData: Omit<Subtask, "_id" | "createdAt" | "updatedAt"> = {
//         title: data.title,
//         status: data.status,
//         priority: data.priority,
//         assignees: data.assignedTo ? [data.assignedTo] : [], // Subtasks use 'assignees' array
//       };
//       createSubtask(
//         {
//           projectId: data.project,
//           taskId: data.parentTaskId,
//           data: subtaskData,
//         },
//         {
//           onSuccess: () => {
//             setShowAddTaskModal(false);
//             setSelectedProjectForTask(null);
//             setEditingTask(null);
//           },
//           onError: (error: any) => {
//             setErrorMessage(
//               error.response?.data?.error || "Failed to create subtask"
//             );
//           },
//         }
//       );
//     } else {
//       const taskData: Omit<
//         Task,
//         "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"
//       > = {
//         title: data.title,
//         description: data.description,
//         priority: data.priority,
//         status: data.status,
//         dueDate: data.dueDate,
//         assignedTo: data.assignedTo || "",
//         subtasks: [],
//       };

//       createTask(
//         { projectId: data.project, data: taskData },
//         {
//           onSuccess: () => {
//             setShowAddTaskModal(false);
//             setSelectedProjectForTask(null);
//             setEditingTask(null);
//           },
//           onError: (error: any) => {
//             setErrorMessage(
//               error.response?.data?.error || "Failed to create task"
//             );
//           },
//         }
//       );
//     }
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
//     // Set the project for fetching tasks
//     const taskProject = projects.find(
//       (p) =>
//         p._id === (typeof task.project === "string" ? task.project : task.project._id)
//     );
//     if (taskProject) {
//       setSelectedProjectForTask(taskProject);
//     }
//     setShowAddTaskModal(true);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     logout();
//   };

//   // Handler to open Add Task modal from Dashboard
//   const openAddTaskFromDashboard = () => {
//     setSelectedProjectForTask(null);
//     setEditingTask(null); // Ensure not in edit mode
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
//           timeEntries={[]}
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
//             onAddTask={openAddTaskFromDashboard}
//           />
//         );
//       case "projects":
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
//             onPageChange={(page) => console.log("Page:", page)}
//             onAddTask={(project) => {
//               setSelectedProjectForTask(project || null);
//               setEditingTask(null); // Ensure not in edit mode
//               setShowAddTaskModal(true);
//             }}
//             onEditTask={openEditTaskModal}
//           />
//         );
//       case "clients":
//         return (
//           <ClientsView clients={clients} onEditClient={handleEditClient} />
//         );
//       case "employees":
//         return (
//           <EmployeesView employees={employees} projects={projects} />
//         );
//       case "settings":
//         return <Settings />;
//       default:
//         return (
//           <DashboardView
//             projects={projects}
//             clients={clients}
//             timeEntries={[]}
//             stats={stats}
//             onAddProject={() => openAddModal("project")}
//             onAddClient={() => openAddModal("client")}
//             setActiveView={setActiveView}
//             onAddTask={openAddTaskFromDashboard}
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
//         <div className="fixed top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg flex items-center z-50">
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
//           // Use the state variable (keep original name if you didn't rename)
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
//             // Use the state variable (keep original name if you didn't rename)
//             setSelectedProjectForTask(null); 
//             setEditingTask(null);
//           }}
//           // --- FIX 1: Pass tasksData directly ---
//           tasks={tasksData as Task[]} 
          
//           // --- FIX 2: Add the onChangeProject prop ---
//           onChangeProject={(projectId: string) => {
//             const newSelectedProject = projects.find(p => p._id === projectId) || null;
//             // Use the state variable (keep original name if you didn't rename)
//             setSelectedProjectForTask(newSelectedProject); 
//           }}
//           // --- END OF FIXES ---
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
//   onAddTask?: () => void;
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
//           <button
//             onClick={() => onAddTask && onAddTask()}
//             className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
//             aria-label="Add task"
//           >
//             <FiPlus /> Add Task
//           </button>
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
import TimesheetsView from "../../components/EmployeeTimeSheet/TimeSheet";
import ProjectsView from "../../components/Projects/Projects";
import ClientsView from "../../components/clients/Clients";
import EmployeesView from "../../components/employees/Employee";
import Settings from "../../components/Setting/Setting";

// --- 1. IMPORT useUpdateClient ---
import {
  useGetClients,
  useAddClient,
  useUpdateClient,
} from "../../hooks/useClient";
import {
  useGetProjects,
  useAddProject,
  useUpdateProject,
} from "../../hooks/useProject";
import {
  useEmployees,
  useCreateUser,
  useUpdateUser,
} from "../../hooks/useEmployee";
import { useManagerDashboardStats } from "../../hooks/useManager";
import { useAuthLogout } from "../../hooks/useAuth";
import {
  useCreateTask,
  useUpdateTask,
  useGetTasks,
  useCreateSubtask,
} from "../../hooks/useTask";
import type { Client, Project, User, TimeEntry } from "../../types/index";
import type { Task, Subtask } from "../../types/task";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

// ====== NEW: import the exact hooks EmployeeDashboard uses ======
import { useGetAllTimeEntries } from "../../hooks/useTimeEntry";
import { useGetDeliverables } from "../../hooks/useDeliverable";
// =============================================================

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
  multiple?: boolean;
}

interface EntityConfig {
  type: "client" | "project" | "employee" | "deliverable";
  title: string;
  fields: FormField[]; // Use the defined FormField interface
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
  const [selectedProjectForTask, setSelectedProjectForTask] =
    useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: logout } = useAuthLogout();

  // Fetch data
  const { data: clientsData = [], isLoading: clientsLoading } = useGetClients();
  const { data: projectsData, isLoading: projectsLoading } = useGetProjects();
  const { data: employeesData, isLoading: employeesLoading } = useEmployees();
  const { data: statsData, isLoading: statsLoading } = useManagerDashboardStats();

  const selectedProjectId =
    selectedProjectForTask?._id || selectedProjectForTask?.id;
  const { data: tasksData = [], isLoading: tasksLoading } =
    useGetTasks(selectedProjectId);

  const { mutate: addClient } = useAddClient();
  const { mutate: addProject } = useAddProject();
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();
  // --- 2. INITIALIZE useUpdateClient ---
  const { mutate: updateClient } = useUpdateClient();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: createSubtask } = useCreateSubtask();

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

  // -----------------------------
  // NEW: fetch time entries & deliverables the same way EmployeeDashboard does
  // -----------------------------
  // We derive the projectId from the same activeView pattern (timesheet-<id>)
  const timesheetProjectId = activeView.startsWith("timesheet-")
    ? activeView.split("timesheet-")[1]
    : "";

  // useGetAllTimeEntries accepts an options object (same shape as EmployeeDashboard)
  const {
    data: managerTimeEntriesData,
    isLoading: managerTimeEntriesLoading,
    error: managerTimeEntriesError,
  } = useGetAllTimeEntries({
    projectId: timesheetProjectId || undefined,
  });

  // useGetDeliverables with enabled flag like EmployeeDashboard
  const {
    data: managerDeliverablesData,
    isLoading: managerDeliverablesLoading,
    error: managerDeliverablesError,
  } = useGetDeliverables(timesheetProjectId, { enabled: !!timesheetProjectId });

  useEffect(() => {
    if (managerTimeEntriesError) {
      console.error("Manager useGetAllTimeEntries error:", managerTimeEntriesError);
    }
  }, [managerTimeEntriesError]);

  useEffect(() => {
    if (managerDeliverablesError) {
      console.error("Manager useGetDeliverables error:", managerDeliverablesError);
    }
  }, [managerDeliverablesError]);
  // -----------------------------
  // end new manager fetch wiring
  // -----------------------------

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

  const clientConfig: EntityConfig = {
    type: "client",
    title: "Client",
    fields: [
      {
        name: "name",
        label: "Client Name",
        type: "text",
        placeholder: "Enter client name",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "client@example.com",
        required: true,
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "+1234567890",
        required: false,
      },
      {
        name: "country",
        label: "Country",
        type: "select",
        placeholder: "Select country",
        required: false,
      },
      {
        name: "billingAddress",
        label: "Billing Address",
        type: "textarea",
        placeholder: "Enter billing address",
        required: false,
      },
      {
        name: "shippingAddress",
        label: "Shipping Address",
        type: "textarea",
        placeholder: "Enter shipping address",
        required: true,
      },
    ],
    onSubmit: (data) => {
      addClient(
        {
          ...data,
          projects: [],
        },
        {
          onSuccess: () => {
            setShowAddModal(false);
            setModalConfig(null);
            setErrorMessage(null);
          },
          onError: (error: any) => {
            setErrorMessage(error.response?.data?.error || "Failed to add client");
          },
        }
      );
    },
  };

  const employeeConfig: EntityConfig = {
    type: "employee",
    title: "Employee",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter full name",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "employee@example.com",
        required: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter password",
        required: true,
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "+1234567890",
        required: true,
      },
      {
        name: "designation",
        label: "Designation",
        type: "text",
        placeholder: "e.g., Software Engineer",
        required: true,
      },
      {
        name: "grade",
        label: "Grade",
        type: "number",
        placeholder: "e.g., 18",
        required: true,
      },
      {
        name: "cnic",
        label: "CNIC",
        type: "text",
        placeholder: "12345-1234567-1",
        required: true,
      },
      {
        name: "role",
        label: "Role",
        type: "select",
        placeholder: "Select role",
        required: true,
        options: [
          { value: "employee", label: "Employee" },
          { value: "manager", label: "Manager" },
        ],
      },
    ],
    onSubmit: (data) => {
      createUser(data, {
        onSuccess: () => {
          setShowAddModal(false);
          setModalConfig(null);
          setErrorMessage(null);
        },
        onError: (error: any) => {
          setErrorMessage(
            error.response?.data?.error || "Failed to create employee"
          );
        },
      });
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
              {
                id: initialData._id,
                data: { ...data, teamMembers: data.teamMembers || [] },
              },
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
            // Use the default onSubmit from projectConfig
            projectConfig.onSubmit(data);
          }
        },
      };
    } else if (type === "client") {
      config = {
        ...clientConfig,
        title: initialData && initialData._id ? "Edit Client" : "Add Client",
        initialData,
        onSubmit: (data: any) => {
          // --- 3. IMPLEMENTED THE UPDATE LOGIC ---
          if (initialData && initialData._id) {
            // Preserve the projects array from initialData
            updateClient(
              {
                id: initialData._id,
                data: { ...data, projects: initialData.projects || [] },
              },
              {
                onSuccess: () => {
                  setShowAddModal(false);
                  setModalConfig(null);
                  setErrorMessage(null);
                },
                onError: (error: any) => {
                  setErrorMessage(
                    error.response?.data?.error || "Failed to update client"
                  );
                },
              }
            );
          } else {
            // Use the default onSubmit from clientConfig for creating
            clientConfig.onSubmit(data);
          }
        },
      };
    } else {
      // 'employee'
      config = {
        ...employeeConfig,
        title: initialData && initialData._id ? "Edit Employee" : "Add Employee",
        initialData,
        // When editing, remove the password field (it shouldn't be required)
        fields:
          initialData && initialData._id
            ? employeeConfig.fields
                .filter((f) => f.name !== "password")
                .map((f) => ({
                  ...f,
                  required: f.name === "password" ? false : f.required,
                }))
            : employeeConfig.fields,
        onSubmit: (data: any) => {
          if (initialData && initialData._id) {
            updateUser(
              { id: initialData._id, data },
              {
                onSuccess: () => {
                  setShowAddModal(false);
                  setModalConfig(null);
                  setErrorMessage(null);
                },
                onError: (error: any) => {
                  setErrorMessage(
                    error.response?.data?.error || "Failed to update employee"
                  );
                },
              }
            );
          } else {
            // Use the default onSubmit from employeeConfig
            employeeConfig.onSubmit(data);
          }
        },
      };
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
    if (data.isSubtask && data.parentTaskId) {
      const subtaskData: Omit<Subtask, "_id" | "createdAt" | "updatedAt"> = {
        title: data.title,
        status: data.status,
        priority: data.priority,
        assignees: data.assignedTo ? [data.assignedTo] : [], // Subtasks use 'assignees' array
      };
      createSubtask(
        {
          projectId: data.project,
          taskId: data.parentTaskId,
          data: subtaskData,
        },
        {
          onSuccess: () => {
            setShowAddTaskModal(false);
            setSelectedProjectForTask(null);
            setEditingTask(null);
          },
          onError: (error: any) => {
            setErrorMessage(
              error.response?.data?.error || "Failed to create subtask"
            );
          },
        }
      );
    } else {
      const taskData: Omit<
        Task,
        "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"
      > = {
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
            setEditingTask(null);
          },
          onError: (error: any) => {
            setErrorMessage(
              error.response?.data?.error || "Failed to create task"
            );
          },
        }
      );
    }
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
    const taskProject = projects.find(
      (p) =>
        p._id === (typeof task.project === "string" ? task.project : task.project._id)
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
    setEditingTask(null); // Ensure not in edit mode
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

      // Normalize manager hook returns to the shape ProjectTimesheetView expects
      const hookTimeEntries = managerTimeEntriesData?.timeEntries || managerTimeEntriesData || [];
      const hookDeliverables = managerDeliverablesData?.deliverables || managerDeliverablesData || [];

      if (managerTimeEntriesLoading || managerDeliverablesLoading) {
        return <div className="p-6">Loading timesheets & deliverables...</div>;
      }

      return (
        <ProjectTimesheetView
          project={{ _id: project._id, name: project.name }}
          timeEntries={(hookTimeEntries as TimeEntry[]) || []}
          // pass deliverables same as EmployeeDashboard passed to ProjectDetailsView
          projects={projects}
          deliverables={hookDeliverables || []}
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
              setEditingTask(null); // Ensure not in edit mode
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
          <EmployeesView employees={employees} projects={projects} />
        );
      case "settings":
        return <Settings />;
      default:
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
          // Use the state variable (keep original name if you didn't rename)
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
            // Use the state variable (keep original name if you didn't rename)
            setSelectedProjectForTask(null); 
            setEditingTask(null);
          }}
          // --- FIX 1: Pass tasksData directly ---
          tasks={tasksData as Task[]} 
          
          // --- FIX 2: Add the onChangeProject prop ---
          onChangeProject={(projectId: string) => {
            const newSelectedProject = projects.find(p => p._id === projectId) || null;
            // Use the state variable (keep original name if you didn't rename)
            setSelectedProjectForTask(newSelectedProject); 
          }}
          // --- END OF FIXES ---
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
