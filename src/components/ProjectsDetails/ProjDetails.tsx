import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";
import type { Employee } from "../../apis/authService";
import type { Project } from "../../types/project";
import type { Deliverable } from "../../types/deliverable";
import AddTimeEntryModal from "../../components/AddTimeEntryModal/TimeEntry";
import AddDeliverableModal from "../../components/AddDeliverbles/AddDeliveryModal";
import type { TimeEntry } from "../../types/timeEntry";

interface ProjectDetailsViewProps {
  projects: Project[];
  deliverables: Deliverable[];
  employee: Employee | null;
  onAddTask: (project: Project) => void;
  onAddDeliverable: () => void;
  setActiveView: (view: string) => void;
}

const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({
  projects,
  deliverables,
  employee,
  onAddTask,
  onAddDeliverable,
  setActiveView,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isTeamLead, setIsTeamLead] = useState(false);
  const [showTimeEntryModal, setShowTimeEntryModal] = useState(false);
  const [showAddDeliverableModal, setShowAddDeliverableModal] = useState(false);
  const [dummyTimesheets, setDummyTimesheets] = useState([
    {
      id: 1,
      userName: "John Doe",
      date: "2023-10-15",
      hours: 8,
      task: "Frontend Development",
      approved: true,
    },
    {
      id: 2,
      userName: "Jane Smith",
      date: "2023-10-15",
      hours: 7.5,
      task: "Backend API Integration",
      approved: false,
    },
    {
      id: 3,
      userName: "Mike Johnson",
      date: "2023-10-15",
      hours: 6,
      task: "Database Optimization",
      approved: true,
    },
    {
      id: 4,
      userName: "John Doe",
      date: "2023-10-16",
      hours: 7,
      task: "UI/UX Design",
      approved: false,
    },
    {
      id: 5,
      userName: "Jane Smith",
      date: "2023-10-16",
      hours: 8,
      task: "Testing",
      approved: true,
    },
  ]);

  useEffect(() => {
    console.log("Projects in Details:", projects);
    console.log("Deliverables:", deliverables);
    console.log("Employee:", employee);

    if (!employee) {
      console.warn("Employee data is not available");
      return;
    }

    if (projects.length > 0) {
      const currentProject = projects[0];
      console.log("Selected Project:", currentProject);
      setProject(currentProject);

      const teamLeadId =
        typeof currentProject.teamLead === "string"
          ? currentProject.teamLead
          : currentProject.teamLead?._id || currentProject.teamLead?.id;

      const employeeId = employee._id || employee.id;
      setIsTeamLead(teamLeadId === employeeId);

      const projectId = currentProject._id || currentProject.id;
      if (!projectId) {
        console.error("Project ID is undefined or missing:", currentProject);
      }
    } else {
      console.warn("No projects available");
    }
  }, [projects, employee]);

  const handleTimeEntrySubmit = (data: TimeEntry) => {
    console.log("Time entry submitted:", data);
    setShowTimeEntryModal(false);

    const newEntry = {
      id: dummyTimesheets.length + 1,
      userName: employee?.name || "Current User",
      date: data.date,
      hours: data.hours,
      task: data.title,
      approved: false,
    };

    setDummyTimesheets([...dummyTimesheets, newEntry]);
  };

  if (!project || !employee) {
    return (
      <div className="p-4 sm:p-6">
        <button
          onClick={() => setActiveView("projects")}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Projects
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500">
            {project
              ? "Employee data not found or loading..."
              : "Project not found or loading..."}
          </p>
        </div>
      </div>
    );
  }

  const projectId = project._id || project.id;
  if (!projectId) {
    console.error("Project ID is undefined in render:", project);
    return (
      <div className="p-4 sm:p-6">
        <button
          onClick={() => setActiveView("projects")}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Projects
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500">Invalid project data</p>
        </div>
      </div>
    );
  }

  const getMemberName = (member: any): string => {
    if (typeof member === "string") return member;
    return member.name || "Unknown Member";
  };

  const getTeamLeadName = (teamLead: any): string => {
    if (typeof teamLead === "string") return teamLead;
    return teamLead.name || "Unknown Team Lead";
  };

  const getClientName = (client: any): string => {
    if (typeof client === "string") return client;
    return client.name || "Unknown Client";
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => setActiveView("projects")}
          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm sm:text-base"
        >
          <FiArrowLeft className="mr-2" /> Back to Projects
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowTimeEntryModal(true)}
            className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center text-sm sm:text-base"
          >
            <FiPlus className="mr-2" /> Enter Time Entry
          </button>
          {isTeamLead && (
            <>
              <button
                onClick={() => onAddTask(project)}
                className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center text-sm sm:text-base"
              >
                <FiPlus className="mr-2" /> Add Task
              </button>
              <button
                onClick={() => setShowAddDeliverableModal(true)}
                className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center text-sm sm:text-base"
              >
                <FiPlus className="mr-2" /> Add Deliverable
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {project.name}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Client: {getClientName(project.client)}
            </p>
            {isTeamLead && (
              <p className="text-sm text-indigo-600 mt-1">
                You are the Team Lead
              </p>
            )}
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              project.status === "active"
                ? "bg-green-100 text-green-800"
                : project.status === "pending"
                ? "bg-amber-100 text-amber-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {project.status?.charAt(0).toUpperCase() +
              project.status?.slice(1) || "Unknown"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
          <div className="flex items-center">
            <FiCalendar className="text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium text-sm sm:text-base">
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <FiUsers className="text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Team Lead</p>
              <p className="font-medium text-sm sm:text-base">
                {getTeamLeadName(project.teamLead)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <FiCheckCircle className="text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Timeline</p>
              <p className="font-medium text-sm sm:text-base">
                {project.estimatedTime || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Team Members
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.teamMembers?.map((member, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-indigo-700">
                  {getMemberName(member).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base">
                  {getMemberName(member)}
                </p>
                <p className="text-sm text-gray-500">Team Member</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Deliverables
          </h2>
          <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
            {deliverables.length} items
          </span>
        </div>

        {deliverables.length === 0 ? (
          <div className="text-center py-8">
            <FiCheckCircle className="mx-auto text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">
              No deliverables yet
            </p>
            {!isTeamLead && (
              <p className="text-sm text-gray-400 mt-2">
                Only team leads can add deliverables
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {deliverables.map((deliverable, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm sm:text-base">
                    {deliverable.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due:{" "}
                    {deliverable.date
                      ? new Date(deliverable.date).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {deliverable.parent && (
                    <p className="text-sm text-gray-400">
                      Revision of:{" "}
                      {typeof deliverable.parent === "string"
                        ? deliverable.parent
                        : deliverable.parent.description}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    deliverable.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : deliverable.status === "delivered"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {deliverable.status?.charAt(0).toUpperCase() +
                    deliverable.status?.slice(1) || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Team Timesheets
          </h2>
          <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
            {dummyTimesheets.length} entries
          </span>
        </div>

        {dummyTimesheets.length === 0 ? (
          <div className="text-center py-8">
            <FiCalendar className="mx-auto text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">
              No timesheet entries yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyTimesheets.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.userName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.hours} hours
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {entry.task}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          entry.approved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {entry.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showTimeEntryModal && (
        <AddTimeEntryModal
          projects={projects}
          employee={employee}
          onSubmit={handleTimeEntrySubmit}
          onClose={() => setShowTimeEntryModal(false)}
        />
      )}

      {showAddDeliverableModal && (
        <AddDeliverableModal
          projectId={String(projectId)}
          employee={employee}
          onClose={() => setShowAddDeliverableModal(false)}
        />
      )}
    </div>
  );
};
export default ProjectDetailsView;
