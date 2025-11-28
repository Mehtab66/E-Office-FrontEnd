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
  FiClipboard,
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
  onAddTask?: (project: Project) => void;
}

// START: MODIFIED COMPONENT FOR THE DROPDOWN MENU
const ActionMenu: React.FC<{
  project: Project;
  position: { top: number; left: number };
  onClose: () => void;
  onEditProject: (id: string, data: Partial<Project>) => void;
  handleTimesheetNavigation: (project: Project) => void;
  onAddTask?: (project: Project) => void;
}> = ({
  project,
  position,
  onClose,
  onEditProject,
  handleTimesheetNavigation,
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
      // UPDATED: Dark Theme Dropdown
      <div ref={dropdownRef} className="origin-top-right absolute mt-2 w-48 rounded-lg shadow-xl bg-slate-900 border border-slate-700 ring-1 ring-black ring-opacity-5 z-50 backdrop-blur-md" style={{ top: position.top, left: position.left }}>
        <div className="py-1" role="menu" aria-orientation="vertical">
          <button onClick={() => { onEditProject(project._id, project); onClose(); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors" role="menuitem"><FiEdit className="w-4 h-4 text-blue-400" />Edit</button>
          <button onClick={() => { handleTimesheetNavigation(project); onClose(); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors" role="menuitem"><FiClock className="w-4 h-4 text-purple-400" />Timesheet</button>
          <button
            onClick={() => {
              if (onAddTask) {
                onAddTask(project);
              }
              onClose();
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
            role="menuitem"
            disabled={!onAddTask}
          >
            <FiClipboard className="w-4 h-4 text-emerald-400" />Assign Task
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
      setMenuData({ project, position: { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX - 160 } });
    }
  };

  const filteredProjects = useMemo(() => projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase())), [projects, searchTerm]);

  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      const aComparable = (typeof aValue === 'object' && aValue !== null && 'name' in aValue) ? aValue.name : aValue;
      const bComparable = (typeof bValue === 'object' && bValue !== null && 'name' in bValue) ? bValue.name : bValue;

      if (aComparable === undefined || bComparable === undefined) return 0;

      if (typeof aComparable === "string" && typeof bComparable === "string") {
        return sortConfig.direction === "asc" ? aComparable.localeCompare(bComparable) : bComparable.localeCompare(aComparable);
      }
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
    if (sortConfig.key !== key) return <FiChevronUp className="inline ml-1 opacity-20" />;
    return sortConfig.direction === "asc" ? <FiChevronUp className="inline ml-1 text-blue-400" /> : <FiChevronDown className="inline ml-1 text-blue-400" />;
  };

  const renderStatusBadge = (status: Project["status"]) => {
    const statusStyles: Record<string, string> = {
      active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      completed: "bg-blue-500/10 text-blue-400 border border-blue-500/20"
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-slate-800 text-slate-400'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const handleTimesheetNavigation = (project: Project) => {
    if (!project || !project._id) { console.error("Invalid project data for timesheet nav:", project); return; }
    setActiveView(`timesheet-${project._id}`);
  };

  const itemsPerPage = 10;
  const startItem = (pagination.currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(pagination.currentPage * itemsPerPage, pagination.totalProjects);

  return (
    // UPDATED: Main Card Container
    <div className="p-4 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-xl shadow-xl backdrop-blur-sm">
      {menuData && (
        <ActionMenu
          project={menuData.project}
          position={menuData.position}
          onClose={() => setMenuData(null)}
          onEditProject={onEditProject}
          handleTimesheetNavigation={handleTimesheetNavigation}
          onAddTask={onAddTask}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <FiBriefcase className="text-blue-500" /> Projects
          <span className="text-sm font-normal text-slate-400 ml-2">({pagination.totalProjects} total)</span>
        </h1>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              {[{ key: "name", label: "Name" }, { key: "client", label: "Client" }, { key: "status", label: "Status" }, { key: "startDate", label: "Start Date" }, { key: "estimatedTime", label: "Est. Time" }, { key: "teamLead", label: "Team Lead" }, { key: "teamMembers", label: "Members" }, { key: "_id", label: "" }].map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  className="px-4 py-4 tracking-wider cursor-pointer whitespace-nowrap hover:text-white transition-colors"
                  onClick={() => header.key && header.key !== "teamMembers" && header.key !== '_id' && handleSort(header.key as keyof Project)}
                >
                  {header.label}
                  {header.key && header.key !== "teamMembers" && header.key !== '_id' && renderSortIcon(header.key as keyof Project)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project) => (
                <tr key={project._id} className="hover:bg-slate-800/30 transition-colors duration-150 group">
                  <td className="px-4 py-4 font-medium text-white whitespace-nowrap">{project.name}</td>
                  <td className="px-4 py-4 text-slate-400">{typeof project.client === "string" ? project.client : project.client?.name || "N/A"}</td>
                  <td className="px-4 py-4">{renderStatusBadge(project.status)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-400">{new Date(project.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-400">{project.estimatedTime}</td>
                  <td className="px-4 py-4 text-slate-400">{typeof project.teamLead === "string" ? project.teamLead : project.teamLead?.name || "N/A"}</td>
                  <td className="px-4 py-4 truncate max-w-xs text-slate-500">{project.teamMembers && project.teamMembers.length > 0 ? project.teamMembers.map((member: any) => typeof member === "string" ? `ID:${member.substring(0, 5)}` : member.name).join(", ") : "None"}</td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={(e) => handleMenuClick(project, e)}
                      className="p-2 rounded-full text-slate-500 hover:bg-slate-800 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Actions for ${project.name}`}
                    >
                      <FiMoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500 italic">
                  {searchTerm ? <>No projects found matching "{searchTerm}"</> : <>No projects available</>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 border-t border-slate-800 pt-6">
          <p className="text-sm text-slate-500">Showing {startItem}-{endItem} of {pagination.totalProjects} projects</p>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => onPageChange(1)} disabled={pagination.currentPage === 1} className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-colors" aria-label="First page">&laquo;</button>
            <button onClick={() => onPageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage} className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-colors" aria-label="Previous page"><FiChevronLeft /></button>
            <span className="text-sm text-slate-400 mx-3 font-medium">Page {pagination.currentPage} of {pagination.totalPages}</span>
            <button onClick={() => onPageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage} className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-colors" aria-label="Next page"><FiChevronRight /></button>
            <button onClick={() => onPageChange(pagination.totalPages)} disabled={pagination.currentPage === pagination.totalPages} className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-colors" aria-label="Last page">&raquo;</button>
          </div>
        </div>
      )}

      {searchTerm && sortedProjects.length === 0 && projects.length > 0 && (
        <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg text-center">
          <p className="text-sm text-amber-500">No projects match your search term "{searchTerm}". Try removing the filter or using different keywords.</p>
          <button onClick={() => setSearchTerm("")} className="mt-2 text-sm text-blue-400 hover:text-blue-300 hover:underline font-medium">Clear search</button>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;