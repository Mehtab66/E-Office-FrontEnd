import React, { useState } from "react";
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiUser,
  FiClock,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiSearch,
  FiPlus,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import AddEntityModal, {
  clientConfig,
  projectConfig,
} from "../../components/AddEntity/AddEntityModal";
import "../../App.css";
// Type definitions
interface Project {
  id: string;
  name: string;
  client: string;
  status: "active" | "pending" | "completed";
  startDate: string;
  estimatedTime: string;
  teamLead: string;
  teamMembers: string[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  billingAddress: string;
  shippingAddress: string;
  projects: string[];
  currency: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  projects: string[];
}

interface TimeEntry {
  id: string;
  employee: string;
  project: string;
  date: string;
  hours: number;
  description: string;
}

// Main Dashboard Component
const ManagerDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<
    typeof projectConfig | typeof clientConfig | null
  >(null);

  // Sample data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      client: "TechCorp Inc.",
      status: "active",
      startDate: "2023-05-15",
      estimatedTime: "3 months",
      teamLead: "Sarah Johnson",
      teamMembers: ["John Doe", "Emily Chen", "Michael Rodriguez"],
    },
    {
      id: "2",
      name: "Mobile App Development",
      client: "Innovate Solutions",
      status: "active",
      startDate: "2023-06-10",
      estimatedTime: "5 months",
      teamLead: "David Kim",
      teamMembers: ["Alex Turner", "Lisa Wang", "James Wilson"],
    },
  ]);

  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "TechCorp Inc.",
      email: "contact@techcorp.com",
      phone: "+1-555-0123",
      country: "United States",
      billingAddress: "123 Tech Ave, San Francisco, CA 94103",
      shippingAddress: "123 Tech Ave, San Francisco, CA 94103",
      projects: ["Website Redesign"],
      currency: "USD",
    },
    {
      id: "2",
      name: "Innovate Solutions",
      email: "info@innovatesolutions.com",
      phone: "+1-555-0456",
      country: "Canada",
      billingAddress: "456 Innovation Rd, Toronto, ON M5H 2N2",
      shippingAddress: "456 Innovation Rd, Toronto, ON M5H 2N2",
      projects: ["Mobile App Development"],
      currency: "CAD",
    },
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Senior Developer",
      email: "sarah@company.com",
      projects: ["Website Redesign"],
    },
    {
      id: "2",
      name: "David Kim",
      role: "Project Lead",
      email: "david@company.com",
      projects: ["Mobile App Development"],
    },
  ]);

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: "1",
      employee: "John Doe",
      project: "Website Redesign",
      date: "2023-07-10",
      hours: 6.5,
      description: "Implemented user authentication",
    },
    {
      id: "2",
      employee: "Emily Chen",
      project: "Website Redesign",
      date: "2023-07-10",
      hours: 7,
      description: "Designed dashboard UI",
    },
  ]);

  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "projects", label: "Projects", icon: <FiBriefcase /> },
    { id: "clients", label: "Clients", icon: <FiUsers /> },
    { id: "employees", label: "Employees", icon: <FiUser /> },
    { id: "timesheets", label: "Timesheets", icon: <FiClock /> },
    { id: "reports", label: "Reports", icon: <FiBarChart2 /> },
    { id: "settings", label: "Settings", icon: <FiSettings /> },
  ];

  // Open add modal with specific configuration
  const openAddModal = (type: "project" | "client") => {
    setModalConfig(type === "project" ? projectConfig : clientConfig);
    setShowAddModal(true);
  };

  // Handle form submission
  const handleAddSubmit = (data: any) => {
    if (modalConfig?.type === "project") {
      setProjects((prev) => [
        ...prev,
        {
          ...data,
          id: String(prev.length + 1),
          teamMembers: data.teamMembers.split(", ").filter(Boolean),
        },
      ]);
    } else if (modalConfig?.type === "client") {
      setClients((prev) => [
        ...prev,
        {
          ...data,
          id: String(prev.length + 1),
          projects: [],
        },
      ]);
    }
    setShowAddModal(false);
    setModalConfig(null);
  };

  // Update modal configs with dynamic clients and employees
  const updatedProjectConfig = {
    ...projectConfig,
    fields: projectConfig.fields.map((field: any) =>
      field.name === "client"
        ? {
            ...field,
            options: clients.map((client) => client.name),
            label: field.label ?? "Client",
            type: field.type ?? "select",
          }
        : field.name === "teamLead" || field.name === "teamMembers"
        ? {
            ...field,
            options: employees.map((employee) => employee.name),
            label:
              field.label ??
              (field.name === "teamLead" ? "Team Lead" : "Team Members"),
            type: field.type ?? "select",
          }
        : {
            ...field,
            label: field.label ?? field.name,
            type: field.type ?? "text",
          }
    ),
    onSubmit: handleAddSubmit,
  };

  const updatedClientConfig = {
    ...clientConfig,
    onSubmit: handleAddSubmit,
  };

  // Render main content based on active view
  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            projects={projects}
            clients={clients}
            employees={employees}
            timeEntries={timeEntries}
            onAddProject={() => openAddModal("project")}
            onAddClient={() => openAddModal("client")}
          />
        );
      case "projects":
        return <ProjectsView projects={projects} />;
      case "clients":
        return <ClientsView clients={clients} />;
      case "employees":
        return <EmployeesView employees={employees} />;
      case "timesheets":
        return <TimesheetsView timeEntries={timeEntries} />;
      default:
        return (
          <DashboardView
            projects={projects}
            clients={clients}
            employees={employees}
            timeEntries={timeEntries}
            onAddProject={() => openAddModal("project")}
            onAddClient={() => openAddModal("client")}
          />
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
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
              <div className="avatar">M</div>
              <div className="user-info">
                <div className="user-name">Manager User</div>
                <div className="user-role">Manager</div>
              </div>
              <FiChevronDown />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="content-area">{renderMainContent()}</div>
      </div>

      {/* Add Modal */}
      {showAddModal && modalConfig && (
        <AddEntityModal
          config={
            modalConfig.type === "project"
              ? updatedProjectConfig
              : updatedClientConfig
          }
          onClose={() => {
            setShowAddModal(false);
            setModalConfig(null);
          }}
        />
      )}
    </div>
  );
};

// Dashboard View Component
interface DashboardViewProps {
  projects: Project[];
  clients: Client[];
  employees: Employee[];
  timeEntries: TimeEntry[];
  onAddProject: () => void;
  onAddClient: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  clients,
  employees,
  timeEntries,
  onAddProject,
  onAddClient,
}) => {
  return (
    <div className="dashboard-view">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={onAddProject}>
            <FiPlus /> Add Project
          </button>
          <button className="btn btn-secondary" onClick={onAddClient}>
            <FiPlus /> Add Client
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon projects">
            <FiBriefcase />
          </div>
          <div className="stat-info">
            <h3>{projects.length}</h3>
            <p>Active Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon clients">
            <FiUsers />
          </div>
          <div className="stat-info">
            <h3>{clients.length}</h3>
            <p>Clients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon employees">
            <FiUser />
          </div>
          <div className="stat-info">
            <h3>{employees.length}</h3>
            <p>Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon hours">
            <FiClock />
          </div>
          <div className="stat-info">
            <h3>
              {timeEntries.reduce((total, entry) => total + entry.hours, 0)}
            </h3>
            <p>Hours This Week</p>
          </div>
        </div>
      </div>

      {/* Projects and Clients Section */}
      <div className="dashboard-content-grid">
        <div className="content-column">
          <div className="card">
            <div className="card-header">
              <h2>Recent Projects</h2>
            </div>
            <div className="card-content">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="list-item">
                  <div className="item-info">
                    <h4>{project.name}</h4>
                    <p>Client: {project.client}</p>
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
                <div key={client.id} className="list-item">
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

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Time Entries</h2>
        </div>
        <div className="card-content">
          {timeEntries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="activity-item">
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

// Other view components (simplified for brevity)
const ProjectsView: React.FC<{ projects: Project[] }> = ({ projects }) => (
  <div className="view-container">
    <h1>Projects</h1>
    {/* Projects table/view implementation */}
  </div>
);

const ClientsView: React.FC<{ clients: Client[] }> = ({ clients }) => (
  <div className="view-container">
    <h1>Clients</h1>
    {/* Clients table/view implementation */}
  </div>
);

const EmployeesView: React.FC<{ employees: Employee[] }> = ({ employees }) => (
  <div className="view-container">
    <h1>Employees</h1>
    {/* Employees table/view implementation */}
  </div>
);

const TimesheetsView: React.FC<{ timeEntries: TimeEntry[] }> = ({
  timeEntries,
}) => (
  <div className="view-container">
    <h1>Timesheets</h1>
    {/* Timesheets table/view implementation */}
  </div>
);

export default ManagerDashboard;
