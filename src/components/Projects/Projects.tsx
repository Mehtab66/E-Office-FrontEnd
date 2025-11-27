
import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  FiBriefcase,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiClock,
  FiMoreVertical,
  FiCheckSquare,
  FiX,
  FiClipboard, // Added for Assign Task icon
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
  onAddTask?: (project: Project) => void; // Changed optional to required if always passed
}


// START: MODIFIED COMPONENT FOR THE DROPDOWN MENU
const ActionMenu: React.FC<{
  project: Project;
  position: { top: number; left: number };
  onClose: () => void;
  onEditProject: (id: string, data: Partial<Project>) => void;
  handleTimesheetNavigation: (project: Project) => void;
  // --- 1. Added onAddTask to props ---
  onAddTask?: (project: Project) => void;
}> = ({
  project,
  position,
  onClose,
  onEditProject,
  handleTimesheetNavigation,
  // --- 2. Destructured onAddTask ---
  onAddTask
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return ReactDOM.createPortal(
      <div ref={dropdownRef} className="origin-top-right absolute mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-border ring-opacity-5 z-50" style={{ top: position.top, left: position.left }}>
        <div className="py-1" role="menu" aria-orientation="vertical">
          <button onClick={() => { onEditProject(project._id, project); onClose(); }} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-3" role="menuitem"><FiEdit className="w-4 h-4" />Edit</button>
          <button onClick={() => { handleTimesheetNavigation(project); onClose(); }} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-3" role="menuitem"><FiClock className="w-4 h-4" />Timesheet</button>
          {/* --- 3. Updated onClick handler --- */}
          <button
            onClick={() => {
              if (onAddTask) {
                onAddTask(project);
              }
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-3"
            role="menuitem"
            disabled={!onAddTask} // Disable if the prop isn't passed
          >
            <FiClipboard className="w-4 h-4" />Assign Task
          </button>
        </div>
      </div>,
      document.body
    );
  };
// END: MODIFIED COMPONENT

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, pagination, onEditProject, timeEntries, onAddDeliverable, setActiveView, onPageChange, onAddTask }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });
  const [menuData, setMenuData] = useState<{ project: Project; position: { top: number; left: number } } | null>(null);

  const handleMenuClick = (project: Project, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (menuData?.project._id === project._id) {
      setMenuData(null);
    } else {
      // Adjusted left position slightly more to the left
      setMenuData({ project, position: { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX - 160 } });
    }
  };

  const filteredProjects = useMemo(() => projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase())), [projects, searchTerm]);

  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      // Handle cases where values might be objects (like client or teamLead)
      const aComparable = (typeof aValue === 'object' && aValue !== null && 'name' in aValue) ? aValue.name : aValue;
      const bComparable = (typeof bValue === 'object' && bValue !== null && 'name' in bValue) ? bValue.name : bValue;

      if (aComparable === undefined || bComparable === undefined) return 0;

      if (typeof aComparable === "string" && typeof bComparable === "string") {
        return sortConfig.direction === "asc" ? aComparable.localeCompare(bComparable) : bComparable.localeCompare(aComparable);
      }
      // Add sorting logic for other types if necessary (e.g., dates)
      if (sortConfig.key === 'startDate') {
        const dateA = new Date(aComparable as string).getTime();
        const dateB = new Date(bComparable as string).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });
    return sorted;
  }, [filteredProjects, sortConfig]);

  const handleSort = (key: keyof Project) => setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));

  const renderSortIcon = (key: keyof Project) => {
    if (sortConfig.key !== key) return <FiChevronUp className="inline ml-1 opacity-20" />; // Show faint default icon
    return sortConfig.direction === "asc" ? <FiChevronUp className="inline ml-1" /> : <FiChevronDown className="inline ml-1" />;
  };

  const renderStatusBadge = (status: Project["status"]) => {
    const statusStyles: Record<string, string> = { active: "bg-green-100 text-green-800", pending: "bg-yellow-100 text-yellow-800", completed: "bg-blue-100 text-blue-800" };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const handleTimesheetNavigation = (project: Project) => {
    if (!project || !project._id) { console.error("Invalid project data for timesheet nav:", project); return; }
    setActiveView(`timesheet-${project._id}`);
  };

  const itemsPerPage = 10; // Consider making this dynamic or a prop
  const startItem = (pagination.currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(pagination.currentPage * itemsPerPage, pagination.totalProjects);

  return (
    <div className="p-4 sm:p-6 bg-card rounded-xl shadow-lg">
      {/* --- 4. Passed onAddTask down to ActionMenu --- */}
      {menuData && (
        <ActionMenu
          project={menuData.project}
          position={menuData.position}
          onClose={() => setMenuData(null)}
          onEditProject={onEditProject}
          handleTimesheetNavigation={handleTimesheetNavigation}
          onAddTask={onAddTask} // <-- Passed prop here
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <FiBriefcase /> Projects
          <span className="text-sm font-normal text-muted-foreground ml-2">({pagination.totalProjects} total)</span>
        </h1>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
        <table className="w-full text-left text-sm text-foreground">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              {/* Added View Details column, removed Actions text column */}
              {[{ key: "name", label: "Name" }, { key: "client", label: "Client" }, { key: "status", label: "Status" }, { key: "startDate", label: "Start Date" }, { key: "estimatedTime", label: "Est. Time" }, { key: "teamLead", label: "Team Lead" }, { key: "teamMembers", label: "Members" }, { key: "_id", label: "" }].map((header) => ( // Use _id for Actions column key
                <th
                  key={header.key}
                  scope="col"
                  className="px-4 py-3 font-semibold tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => header.key && header.key !== "teamMembers" && header.key !== '_id' && handleSort(header.key as keyof Project)}
                >
                  {header.label}
                  {header.key && header.key !== "teamMembers" && header.key !== '_id' && renderSortIcon(header.key as keyof Project)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project) => (
                <tr key={project._id} className="border-b border-border hover:bg-muted/50 transition-colors duration-150">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{project.name}</td>
                  <td className="px-4 py-3">{typeof project.client === "string" ? project.client : project.client?.name || "N/A"}</td>
                  <td className="px-4 py-3">{renderStatusBadge(project.status)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(project.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{project.estimatedTime}</td>
                  <td className="px-4 py-3">{typeof project.teamLead === "string" ? project.teamLead : project.teamLead?.name || "N/A"}</td>
                  <td className="px-4 py-3 truncate max-w-xs">{project.teamMembers && project.teamMembers.length > 0 ? project.teamMembers.map((member: any) => typeof member === "string" ? `ID:${member.substring(0, 5)}` : member.name).join(", ") : "None"}</td>
                  {/* Actions Button */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => handleMenuClick(project, e)}
                      className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background focus:ring-primary"
                      aria-label={`Actions for ${project.name}`}
                    >
                      <FiMoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground italic">
                  {searchTerm ? <>No projects found matching "{searchTerm}"</> : <>No projects available</>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <p className="text-sm text-muted-foreground">Showing {startItem}-{endItem} of {pagination.totalProjects} projects</p>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => onPageChange(1)} disabled={pagination.currentPage === 1} className="p-2 bg-muted rounded-lg text-foreground disabled:opacity-50 hover:bg-muted/80 transition-colors" aria-label="First page">&laquo;</button>
            <button onClick={() => onPageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage} className="p-2 bg-muted rounded-lg text-foreground disabled:opacity-50 hover:bg-muted/80 transition-colors" aria-label="Previous page"><FiChevronLeft /></button>
            <span className="text-sm text-muted-foreground mx-2">Page {pagination.currentPage} of {pagination.totalPages}</span>
            <button onClick={() => onPageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage} className="p-2 bg-muted rounded-lg text-foreground disabled:opacity-50 hover:bg-muted/80 transition-colors" aria-label="Next page"><FiChevronRight /></button>
            <button onClick={() => onPageChange(pagination.totalPages)} disabled={pagination.currentPage === pagination.totalPages} className="p-2 bg-muted rounded-lg text-foreground disabled:opacity-50 hover:bg-muted/80 transition-colors" aria-label="Last page">&raquo;</button>

          </div>
        </div>
      )}

      {/* Message for empty search results when there ARE projects */}
      {searchTerm && sortedProjects.length === 0 && projects.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-sm text-yellow-800">No projects match your search term "{searchTerm}". Try removing the filter or using different keywords.</p>
          <button onClick={() => setSearchTerm("")} className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline font-medium">Clear search</button>
        </div>
      )}

    </div>
  );
};

export default ProjectsView;