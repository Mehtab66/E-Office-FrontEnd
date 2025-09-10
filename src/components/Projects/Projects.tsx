import React, { useState, useMemo } from "react";
import {
  FiBriefcase,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiClock,
} from "react-icons/fi";
import type { Project, TimeEntry, Deliverable } from "../../types";

interface ProjectsViewProps {
  projects: Project[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProjects: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onEditProject: (id: string, data: Partial<Project>) => void;
  timeEntries: TimeEntry[];
  onAddDeliverable: (data: Deliverable) => void;
  setActiveView: (view: string) => void;
  onPageChange: (page: number) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  pagination,
  onEditProject,
  timeEntries,
  onAddDeliverable,
  setActiveView,
  onPageChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  // Filter projects based on search term (client-side filtering for current page)
  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  // Sort projects (client-side sorting for current page)
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
    return sorted;
  }, [filteredProjects, sortConfig]);

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

  // Handle timesheet navigation with validation
  const handleTimesheetNavigation = (project: Project) => {
    if (!project || !project._id || !project.name) {
      console.error("Invalid project data:", project);
      alert("Error: Invalid project data");
      return;
    }
    setActiveView(`timesheet-${project._id}`);
  };

  // Calculate display range
  const itemsPerPage = 10;
  const startItem = (pagination.currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    pagination.currentPage * itemsPerPage,
    pagination.totalProjects
  );

  return (
    <div className="p-6 bg-card rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <FiBriefcase /> Projects
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({pagination.totalProjects} total)
          </span>
        </h1>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-foreground">
          <thead className="bg-muted">
            <tr>
              {[
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
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="px-4 py-3 font-medium">{project.name}</td>
                  <td className="px-4 py-3">
                    {typeof project.client === "string"
                      ? project.client
                      : project.client?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {renderStatusBadge(project.status)}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(project.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{project.estimatedTime}</td>
                  <td className="px-4 py-3">
                    {typeof project.teamLead === "string"
                      ? project.teamLead
                      : project.teamLead?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {project.teamMembers && project.teamMembers.length > 0
                      ? project.teamMembers
                          .map((member: string | { name: string }) =>
                            typeof member === "string" ? member : member.name
                          )
                          .join(", ")
                      : "None"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => onEditProject(project._id, project)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-1 text-sm"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleTimesheetNavigation(project)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1 text-sm"
                    >
                      <FiClock /> Timesheet
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {searchTerm ? (
                    <>No projects found matching "{searchTerm}"</>
                  ) : (
                    <>No projects found</>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {pagination.totalProjects}{" "}
            projects
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-2 bg-muted rounded-lg text-foreground disabled:opacity-50 hover:bg-muted/80 transition-colors"
            >
              <FiChevronLeft />
            </button>

            <div className="flex gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  // Show pages around current page
                  let pageNum = i + 1;
                  if (pagination.currentPage > 3) {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  if (pageNum > pagination.totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        pageNum === pagination.currentPage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="p-2 bg-muted rounded-lg text-foreground disabled:opacity-50 hover:bg-muted/80 transition-colors"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Show message when filtering returns no results but there are projects */}
      {searchTerm && sortedProjects.length === 0 && projects.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800">
            No projects match your search. Try a different search term or{" "}
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              clear search
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
