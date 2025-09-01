import React, { useState, useMemo } from "react";
import {
  FiBriefcase,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
} from "react-icons/fi";
import AddEntityModal, { projectConfig } from "../AddEntity/AddEntityModal";

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

interface TimeEntry {
  id: string;
  employee: string;
  project: string;
  date: string;
  hours: number;
  description: string;
}

interface Deliverable {
  id: string;
  date: string;
  description: string;
  notes: string;
}

interface ProjectsViewProps {
  projects: Project[];
  onEditProject: (id: string, data: any) => void;
  timeEntries: TimeEntry[];
  onAddDeliverable: (data: Deliverable) => void;
  setActiveView: (view: string) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onEditProject,
  timeEntries,
  onAddDeliverable,
  setActiveView,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const itemsPerPage = 10;

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
    return sorted;
  }, [filteredProjects, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting
  const handleSort = (key: keyof Project) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Render sort icon
  const renderSortIcon = (key: keyof Project) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <FiChevronUp className="inline ml-1" />
    ) : (
      <FiChevronDown className="inline ml-1" />
    );
  };

  // Render status badge
  const renderStatusBadge = (status: Project["status"]) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle edit project
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  // Handle save edited project
  const handleSaveEdit = (data: any) => {
    onEditProject(editingProject!.id, data);
    setEditingProject(null);
  };

  // Handle timesheet navigation with validation
  const handleTimesheetNavigation = (project: Project) => {
    console.log("Setting active view for timesheet:", project.id, project.name); // Debug log
    if (!project || !project.id || !project.name) {
      console.error("Invalid project data:", project);
      alert("Error: Invalid project data");
      return;
    }
    setActiveView(`timesheet-${project.id}`);
  };

  return (
    <div className="p-6 bg-card rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <FiBriefcase /> Projects
        </h1>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-foreground">
          <thead className="bg-muted">
            <tr>
              {[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "client", label: "Client" },
                { key: "status", label: "Status" },
                { key: "startDate", label: "Start Date" },
                { key: "estimatedTime", label: "Estimated Time" },
                { key: "teamLead", label: "Team Lead" },
                { key: "teamMembers", label: "Team Members" },
                { key: "", label: "Actions" },
              ].map((header) => (
                <th
                  key={header.key}
                  className="px-4 py-3 font-semibold text-muted-foreground cursor-pointer"
                  onClick={() =>
                    header.key &&
                    header.key !== "teamMembers" &&
                    handleSort(header.key as keyof Project)
                  }
                >
                  {header.label}
                  {header.key &&
                    header.key !== "teamMembers" &&
                    renderSortIcon(header.key as keyof Project)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="px-4 py-3">{project.id}</td>
                  <td className="px-4 py-3 font-medium">{project.name}</td>
                  <td className="px-4 py-3">{project.client}</td>
                  <td className="px-4 py-3">
                    {renderStatusBadge(project.status)}
                  </td>
                  <td className="px-4 py-3">{project.startDate}</td>
                  <td className="px-4 py-3">{project.estimatedTime}</td>
                  <td className="px-4 py-3">{project.teamLead}</td>
                  <td className="px-4 py-3">
                    {project.teamMembers.join(", ") || "None"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-1"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleTimesheetNavigation(project)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
                    >
                      More 
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-3 text-center text-muted-foreground"
                >
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedProjects.length)} of{" "}
            {sortedProjects.length} projects
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-muted rounded-lg text-foreground disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-muted rounded-lg text-foreground disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <AddEntityModal
          config={{
            ...projectConfig,
            title: "Edit Project",
            onSubmit: handleSaveEdit,
          }}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectsView;
