import React, { useEffect } from "react";
import { FiBriefcase, FiPlus } from "react-icons/fi";
import type { Employee } from "../../apis/authService";
import type { Project } from "../../types/project";

interface ProjectsViewProps {
  projects: Project[];
  employee: Employee;
  setActiveView: (view: string) => void;
  onAddTask: (project?: Project) => void;
  onAddDeliverable: () => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  employee,
  setActiveView,
  onAddTask,
}) => {
  useEffect(() => {
    console.log("Projects updated:", projects);
  }, [projects]);

  // Helper function to get team member name
  const getMemberName = (member: any): string => {
    if (typeof member === "string") return member;
    return member.name || "Unknown";
  };

  // Helper function to get team member initial
  const getMemberInitial = (member: any): string => {
    const name = getMemberName(member);
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600">Manage your projects and tasks</p>
        </div>
        <div className="flex items-center gap-3">
          {projects.some((p) => {
            const teamLeadId =
              typeof p.teamLead === "string"
                ? p.teamLead
                : p.teamLead?._id || p.teamLead?.id;
            return teamLeadId === employee.id;
          }) && (
            <button
              onClick={() => onAddTask()}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
            >
              <FiPlus className="mr-2" /> Add Task
            </button>
          )}
          
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project.id || project._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() =>
              setActiveView(`project-${project.id || project._id}`)
            }
          >
            <div className="p-5 border-b border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`p-2 rounded-lg ${
                    project.status === "active"
                      ? "bg-green-100"
                      : project.status === "pending"
                      ? "bg-amber-100"
                      : "bg-gray-100"
                  }`}
                >
                  <FiBriefcase
                    className={
                      project.status === "active"
                        ? "text-green-600"
                        : project.status === "pending"
                        ? "text-amber-600"
                        : "text-gray-600"
                    }
                  />
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    project.status === "active"
                      ? "bg-green-100 text-green-800"
                      : project.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {project.status &&
                    project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {project.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {typeof project.client === "string"
                  ? project.client
                  : project.client?.name || "Unknown Client"}
              </p>
            </div>
            <div className="p-5 bg-gray-50">
              <div className="flex justify-between text-sm text-gray-600">
                <div>
                  <p className="font-medium">Start Date</p>
                  <p>
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Timeline</p>
                  <p>{project.estimatedTime || "N/A"}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Team Members ({project.teamMembers?.length || 0})
                </p>
                <div className="flex -space-x-2">
                  {project.teamMembers?.slice(0, 4).map((member, index) => (
                    <div
                      key={index}
                      className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-white"
                    >
                      <span className="text-xs font-medium text-indigo-700">
                        {getMemberInitial(member)}
                      </span>
                    </div>
                  ))}
                  {project.teamMembers && project.teamMembers.length > 4 && (
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-xs font-medium text-gray-700">
                        +{project.teamMembers.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;
