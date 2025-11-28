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
// import TimesheetsView from "../../components/EmployeeTimeSheet/TimeSheet";
// import ProjectsView from "../../components/Projects/Projects";
// import ClientsView from "../../components/clients/Clients";
// import EmployeesView from "../../components/employees/Employee";
// import Settings from "../../components/Setting/Setting";

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

// import { useGetAllTimeEntries } from "../../hooks/useTimeEntry";
// import { useGetDeliverables } from "../../hooks/useDeliverable";

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
//   fields: FormField[];
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

//   useEffect(() => {
//     console.log("Tasks data for project:", {
//       projectId: selectedProjectId,
//       tasks: tasksData,
//       count: tasksData?.length || 0,
//     });
//   }, [selectedProjectId, tasksData]);

//   const timesheetProjectId = activeView.startsWith("timesheet-")
//     ? activeView.split("timesheet-")[1]
//     : "";

//   const {
//     data: managerTimeEntriesData,
//     isLoading: managerTimeEntriesLoading,
//     error: managerTimeEntriesError,
//   } = useGetAllTimeEntries({
//     projectId: timesheetProjectId || undefined,
//   });

//   const {
//     data: managerDeliverablesData,
//     isLoading: managerDeliverablesLoading,
//     error: managerDeliverablesError,
//   } = useGetDeliverables(timesheetProjectId, { enabled: !!timesheetProjectId });

//   useEffect(() => {
//     if (managerTimeEntriesError) {
//       console.error("Manager useGetAllTimeEntries error:", managerTimeEntriesError);
//     }
//   }, [managerTimeEntriesError]);

//   useEffect(() => {
//     if (managerDeliverablesError) {
//       console.error("Manager useGetDeliverables error:", managerDeliverablesError);
//     }
//   }, [managerDeliverablesError]);

//   const navItems = [
//     { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
//     { id: "projects", label: "Projects", icon: <FiBriefcase /> },
//     { id: "clients", label: "Clients", icon: <FiUsers /> },
//     { id: "employees", label: "Employees", icon: <FiUser /> },
//     { id: "settings", label: "Profile", icon: <FiSettings /> },
//   ];

//   const normalizedActiveView = activeView.startsWith("timesheet-")
//     ? "projects"
//     : activeView;

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
//           value: employee._id || (employee as any).id,
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
//           value: employee._id || (employee as any).id,
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
//           if (initialData && initialData._id) {
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
//             clientConfig.onSubmit(data);
//           }
//         },
//       };
//     } else {
//       config = {
//         ...employeeConfig,
//         title: initialData && initialData._id ? "Edit Employee" : "Add Employee",
//         initialData,
//         fields:
//           initialData && initialData._id
//             ? employeeConfig.fields
//               .filter((f) => f.name !== "password")
//               .map((f) => ({
//                 ...f,
//                 required: f.name === "password" ? false : f.required,
//               }))
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
//             employeeConfig.onSubmit(data);
//           }
//         },
//       };
//     }

//     setModalConfig(config);
//     setShowAddModal(true);
//     setErrorMessage(null);
//   };

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
//         assignees: data.assignedTo ? [data.assignedTo] : [],
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

//   const openEditTaskModal = (task: Task) => {
//     setEditingTask(task);
//     const taskProject = projects.find(
//       (p) =>
//         p._id === (typeof task.project === "string" ? task.project : task.project._id)
//     );
//     if (taskProject) {
//       setSelectedProjectForTask(taskProject);
//     }
//     setShowAddTaskModal(true);
//   };

//   const handleLogout = () => {
//     logout();
//   };

//   const openAddTaskFromDashboard = () => {
//     setSelectedProjectForTask(null);
//     setEditingTask(null);
//     setShowAddTaskModal(true);
//   };

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

//       const hookTimeEntries = managerTimeEntriesData?.timeEntries || managerTimeEntriesData || [];
//       const hookDeliverables = managerDeliverablesData?.deliverables || managerDeliverablesData || [];

//       if (managerTimeEntriesLoading || managerDeliverablesLoading) {
//         return <div className="p-6">Loading timesheets & deliverables...</div>;
//       }

//       return (
//         <ProjectTimesheetView
//           project={{ _id: project._id, name: project.name }}
//           timeEntries={(hookTimeEntries as TimeEntry[]) || []}
//           projects={projects}
//           deliverables={hookDeliverables || []}
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
//               setEditingTask(null);
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
//         {/* Wrap sidebar content in a full-height flex column so bottom section sticks to bottom */}
//         <div className="flex flex-col h-full">
//           <div className="sidebar-header">
//             <div className="logo">
//               <FiBriefcase className="logo-icon" />
//               <span>ProjectFlow</span>
//             </div>
//             <button
//               className="sidebar-close"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <FiX />
//             </button>
//           </div>

//           {/* Main nav (exclude the 'settings' / Profile item here so we can render it at bottom) */}
//           <nav className="sidebar-nav">
//             {navItems
//               .filter((item) => item.id !== "settings")
//               .map((item) => (
//                 <button
//                   key={item.id}
//                   className={`nav-item ${normalizedActiveView === item.id ? "active" : ""}`}
//                   onClick={() => setActiveView(item.id)}
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </button>
//               ))}
//           </nav>

//           {/* BOTTOM: profile + logout — pushed to the very bottom using mt-auto */}
//           <div className="mt-auto px-4 py-4">
//             <button
//               className={`nav-item w-full justify-start profile-footer`}
//               onClick={() => setActiveView("settings")}
//             >
//               <div className="sidebar-profile-footer flex items-center gap-3">
//                 <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
//                 <div className="sidebar-user-info text-left">
//                   <div className="user-name">{user?.name || "User"}</div>
//                   <div className="user-role text-white font-bold">
//                     {user?.role ? user.role.replace("_", " ").toUpperCase() : ""}
//                   </div>
//                 </div>
//               </div>
//             </button>

//             <div className="mt-4">
//               <button
//                 onClick={handleLogout}
//                 className="w-full px-4 py-2 bg-white text-gray-800 rounded-lg flex items-center justify-center gap-2 shadow-sm"
//               >
//                 <FiLogOut />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="main-content">
//         <div className="top-nav flex items-center justify-between">
//           <div className="left-controls flex items-center">
//             <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
//               <FiMenu />
//             </button>
//           </div>

//           {/* right side: place bell icon on the right of the navbar 
//           <div className="right-controls flex items-center">
//             <div className="notifications">
//               <FiBell />
//               <span className="notification-badge">3</span>
//             </div>
//           </div>*/}
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
//           tasks={tasksData as Task[]}
//           onChangeProject={(projectId: string) => {
//             const newSelectedProject = projects.find(p => p._id === projectId) || null;
//             setSelectedProjectForTask(newSelectedProject);
//           }}
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
//                   className="list-item"
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

import { useGetAllTimeEntries } from "../../hooks/useTimeEntry";
import { useGetDeliverables } from "../../hooks/useDeliverable";

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
  fields: FormField[];
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

  useEffect(() => {
    console.log("Tasks data for project:", {
      projectId: selectedProjectId,
      tasks: tasksData,
      count: tasksData?.length || 0,
    });
  }, [selectedProjectId, tasksData]);

  const timesheetProjectId = activeView.startsWith("timesheet-")
    ? activeView.split("timesheet-")[1]
    : "";

  const {
    data: managerTimeEntriesData,
    isLoading: managerTimeEntriesLoading,
    error: managerTimeEntriesError,
  } = useGetAllTimeEntries({
    projectId: timesheetProjectId || undefined,
  });

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

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "projects", label: "Projects", icon: <FiBriefcase /> },
    { id: "clients", label: "Clients", icon: <FiUsers /> },
    { id: "employees", label: "Employees", icon: <FiUser /> },
    { id: "settings", label: "Profile", icon: <FiSettings /> },
  ];

  const normalizedActiveView = activeView.startsWith("timesheet-")
    ? "projects"
    : activeView;

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
          value: employee._id || (employee as any).id,
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
          value: employee._id || (employee as any).id,
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
          if (initialData && initialData._id) {
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
            clientConfig.onSubmit(data);
          }
        },
      };
    } else {
      config = {
        ...employeeConfig,
        title: initialData && initialData._id ? "Edit Employee" : "Add Employee",
        initialData,
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
            employeeConfig.onSubmit(data);
          }
        },
      };
    }

    setModalConfig(config);
    setShowAddModal(true);
    setErrorMessage(null);
  };

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
        assignees: data.assignedTo ? [data.assignedTo] : [],
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

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    const taskProject = projects.find(
      (p) =>
        p._id === (typeof task.project === "string" ? task.project : task.project._id)
    );
    if (taskProject) {
      setSelectedProjectForTask(taskProject);
    }
    setShowAddTaskModal(true);
  };

  const handleLogout = () => {
    logout();
  };

  const openAddTaskFromDashboard = () => {
    setSelectedProjectForTask(null);
    setEditingTask(null);
    setShowAddTaskModal(true);
  };

  const renderMainContent = () => {
    if (clientsLoading || projectsLoading || employeesLoading || statsLoading) {
      return <div className="p-6 text-slate-300">Loading...</div>;
    }

    if (activeView.startsWith("timesheet-")) {
      const projectId = activeView.split("timesheet-")[1];
      const project = projects.find((p) => p._id === projectId);
      if (!project) {
        return (
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl shadow-lg backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-white">
              Project not found
            </h1>
            <button
              onClick={() => setActiveView("projects")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              Back to Projects
            </button>
          </div>
        );
      }

      const hookTimeEntries = managerTimeEntriesData?.timeEntries || managerTimeEntriesData || [];
      const hookDeliverables = managerDeliverablesData?.deliverables || managerDeliverablesData || [];

      if (managerTimeEntriesLoading || managerDeliverablesLoading) {
        return <div className="p-6 text-slate-300">Loading timesheets & deliverables...</div>;
      }

      return (
        <ProjectTimesheetView
          project={{ _id: project._id, name: project.name }}
          timeEntries={(hookTimeEntries as TimeEntry[]) || []}
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
              setEditingTask(null);
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
    // THEME CONTAINER: Digital Horizon 3D Professional Theme
    <div className="flex h-screen bg-[#0f172a] relative overflow-hidden text-slate-200">

      {/* 1. Deep Space Base */}
      <div className="absolute inset-0 bg-slate-950 z-0" />

      {/* 2. The Horizon Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-900/10 rounded-[100%] blur-[100px] pointer-events-none z-0" />

      {/* 3. 3D Perspective Grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:linear-gradient(to_bottom,transparent_40%,#000_100%)] pointer-events-none opacity-20 z-0"
        style={{ transform: "perspective(1000px) rotateX(20deg) scale(1.2)" }}
      />

      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-900/90 border border-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-[100] backdrop-blur-md">
          <FiX className="mr-2" />
          {errorMessage}
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-4 hover:text-red-200"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* SIDEBAR: Glass Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-slate-900/90 border-r border-slate-800 backdrop-blur-xl lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
            <div className="flex items-center gap-2 text-blue-500">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FiBriefcase className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">ProjectFlow</span>
            </div>
            <button
              className="ml-auto lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 py-6 space-y-1 px-3">
            {navItems
              .filter((item) => item.id !== "settings")
              .map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium transition-all rounded-lg group ${normalizedActiveView === item.id
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(37,99,235,0.1)]"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }`}
                  onClick={() => setActiveView(item.id)}
                >
                  <span className={normalizedActiveView === item.id ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
          </nav>

          <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
            <button
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors mb-3"
              onClick={() => setActiveView("settings")}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-white">{user?.name || "User"}</div>
                <div className="text-xs text-blue-400 font-medium">
                  {user?.role ? user.role.replace("_", " ").toUpperCase() : ""}
                </div>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all border border-slate-700"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800/30 bg-slate-900/30 backdrop-blur-sm">
          <div className="flex items-center">
            <button className="lg:hidden p-2 text-slate-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {renderMainContent()}
        </main>
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
          tasks={tasksData as Task[]}
          onChangeProject={(projectId: string) => {
            const newSelectedProject = projects.find(p => p._id === projectId) || null;
            setSelectedProjectForTask(newSelectedProject);
          }}
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Welcome back to your workspace</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onAddTask && onAddTask()}
            className="px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] border border-blue-500/50 flex items-center gap-2 font-medium text-sm"
          >
            <FiPlus className="w-4 h-4" /> Add Task
          </button>
          <button
            className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all border border-indigo-500/50 flex items-center gap-2 font-medium text-sm shadow-lg shadow-indigo-900/20"
            onClick={onAddProject}
          >
            <FiBriefcase className="w-4 h-4" /> Add Project
          </button>
          <button
            className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700 flex items-center gap-2 font-medium text-sm"
            onClick={onAddClient}
          >
            <FiUsers className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiBriefcase className="w-24 h-24 text-blue-500" />
          </div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-400 font-medium">Active Projects</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.projects}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
              <FiBriefcase className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiUsers className="w-24 h-24 text-purple-500" />
          </div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-400 font-medium">Total Clients</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.clients}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiUser className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-400 font-medium">Team Members</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.employees}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
              <FiUser className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm flex flex-col">
          <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
            <button
              onClick={() => setActiveView("projects")}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View All
            </button>
          </div>
          <div className="flex-1 p-0">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No projects found.</div>
            ) : (
              projects.slice(0, 3).map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"
                >
                  <div>
                    <h4 className="text-white font-medium text-sm">{project.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Client:{" "}
                      <span className="text-slate-300">
                        {typeof project.client === "string"
                          ? project.client
                          : project.client.name}
                      </span>
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      project.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm flex flex-col">
          <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Clients</h2>
            <button
              onClick={() => setActiveView("clients")}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View All
            </button>
          </div>
          <div className="flex-1 p-0">
            {clients.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No clients found.</div>
            ) : (
              clients.slice(0, 3).map((client) => (
                <div key={client._id} className="flex items-center justify-between p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 font-medium">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{client.name}</h4>
                      <p className="text-xs text-slate-400">{client.projects.length} active projects</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">Active</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800/60">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="p-0">
          {timeEntries.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No recent activity.</div>
          ) : (
            timeEntries.slice(0, 5).map((entry) => (
              <div key={entry._id} className="flex items-start gap-4 p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                <div className="mt-1 p-2 rounded-full bg-slate-800 text-slate-400">
                  <FiClock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-300">
                    <strong className="text-white font-medium">{entry.employee}</strong> logged <span className="text-blue-400">{entry.hours} hours</span>
                    {" "}on <strong className="text-white font-medium">{entry.project}</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{entry.description}</p>
                </div>
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{entry.date}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;