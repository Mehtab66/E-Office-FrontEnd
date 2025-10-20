import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/EmployeeSidebar/Sidebar";
import DashboardView from "../../components/EmployeeDashboardView/DashboardView";
import ProjectsView from "../../components/ProjectViews/ProjectView";
import TasksView from "../../components/EmployeeTasks/Tasks";
import TimesheetsView from "../../components/EmployeeTimeSheet/TimeSheet";
import ProjectDetailsView from "../../components/ProjectsDetails/ProjDetails";
import AddTimeEntryModal from "../../components/AddTimeEntryModal/TimeEntry";
import AddTaskModal from "../../components/AddTask/AddTask";
import AddDeliverableModal from "../../components/AddDeliverbles/AddDeliveryModal";
import EmployeeDashboardStats from "../../components/EmployeeDashboardStats/EmployeeDashboardStats";
import { useCurrentUser } from "../../apis/authService";
import { useGetProjects } from "../../hooks/useProject";
import { useGetAllTasks } from "../../hooks/useTask";
import { useGetAllTimeEntries } from "../../hooks/useTimeEntry";
import {
  useGetDeliverables,
  useCreateDeliverable,
} from "../../hooks/useDeliverable";
import { useCreateTask, useCreateSubtask } from "../../hooks/useTask";
import {
  useCreateTimeEntry,
  useDeleteTimeEntry,
} from "../../hooks/useTimeEntry";
import type { Task, Subtask } from "../../types/task";
import type { TimeEntry } from "../../types/timeEntry";
import type { Project } from "../../types/project";
import type { User } from "../../apis/authService";

// Create a helper function to get the employee ID
const getEmployeeId = (employee: User | null | undefined): string => {
  if (!employee) return "";
  // Handle both _id and id fields
  return (employee as any).id || employee._id || "";
};

// Create a helper function to get the employee projects
const getEmployeeProjects = (employee: User | null | undefined): string[] => {
  if (!employee) return [];
  return "projects" in employee ? (employee as any).projects || [] : [];
};

const EmployeeDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<Project | null>(null);
  const [showAddDeliverableModal, setShowAddDeliverableModal] = useState(false);
  const [editTimeEntry, setEditTimeEntry] = useState<TimeEntry | undefined>(
    undefined
  );

  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const queryClient = useQueryClient();

  // Fetch current employee
  const {
    data: employee,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useCurrentUser();

  // Fetch projects
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    error: projectsError,
  } = useGetProjects();
  const projects = projectsData?.projects || [];

  // Fetch tasks with filters
  const {
    data: tasksData,
    isLoading: isTasksLoading,
    error: tasksError,
  } = useGetAllTasks({
    projectId: projectFilter || undefined,
    priority: priorityFilter || undefined,
    status: statusFilter || undefined,
  });
  const tasks = tasksData?.tasks || [];

  // Fetch time entries with filters
  const {
    data: timeEntriesData,
    isLoading: isTimeEntriesLoading,
    error: timeEntriesError,
  } = useGetAllTimeEntries({
    projectId: projectFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });
  const timeEntries = timeEntriesData?.timeEntries || [];

  // Fetch deliverables for specific project
  const projectId = activeView.startsWith("project-")
    ? activeView.split("project-")[1]
    : "";
  const {
    data: deliverables,
    isLoading: isDeliverablesLoading,
    error: deliverablesError,
  } = useGetDeliverables(projectId, {
    enabled: !!projectId,
  });

  // Mutations
  const createTimeEntry = useCreateTimeEntry();
  const deleteTimeEntry = useDeleteTimeEntry();
  const createTask = useCreateTask();
  const createSubtask = useCreateSubtask();
  const createDeliverable = useCreateDeliverable();

  // Filter projects for employee (team lead, member, or in employee.projects)
  const employeeProjects = projects.filter((project: Project) => {
    const employeeId = getEmployeeId(employee);
    if (!employeeId) return false;

    const teamLeadId =
      typeof project.teamLead === "string"
        ? project.teamLead
        : project.teamLead?._id || project.teamLead?.id;

    const teamMemberIds = project.teamMembers.map((member) =>
      typeof member === "string" ? member : member._id || member.id
    );

    const projectIds = getEmployeeProjects(employee);

    return (
      teamMemberIds.includes(employeeId) ||
      teamLeadId === employeeId ||
      projectIds.includes((project._id || project.id || "").toString())
    );
  });
  // Add this to your EmployeeDashboard component
  useEffect(() => {
    if (employee && projects.length > 0) {
      console.log("Employee ID:", employee.id);

      const teamLeadProjects = projects.filter((p) => {
        const teamLeadId =
          typeof p.teamLead === "string"
            ? p.teamLead
            : p.teamLead?._id || p.teamLead?.id;
        console.log("Project:", p.name, "Team Lead ID:", teamLeadId);
        return teamLeadId === employee.id;
      });

      console.log("Team Lead Projects Count:", teamLeadProjects.length);
      console.log("Team Lead Projects:", teamLeadProjects);
    }
  }, [employee, projects]);
  useEffect(() => {
    console.log("Project updated in EmployeeDashboard:", projectsData);
    console.log("Employee:", employee);
    console.log("EmployeeProjects:", employeeProjects);
    if (projects.length > 0 && employee) {
      projects.forEach((project: Project) => {
        const teamLeadId =
          typeof project.teamLead === "string"
            ? project.teamLead
            : project.teamLead?._id || project.teamLead?.id;
        const teamMemberIds = project.teamMembers.map((member) =>
          typeof member === "string" ? member : member._id || member.id
        );
        console.log("Filtering project:", {
          projectId: project._id || project.id,
          projectName: project.name,
          teamLeadId,
          teamMemberIds,
          employeeId: getEmployeeId(employee),
          employeeProjects: getEmployeeProjects(employee),
          isIncluded: employeeProjects.some(
            (p) => p._id === project._id || p.id === project.id
          ),
        });
      });
    }
  }, [projectsData, employee, employeeProjects]);

  const handleAddTimeEntry = (
    data: Omit<
      TimeEntry,
      "_id" | "user" | "project" | "createdAt" | "updatedAt"
    >
  ) => {
    if (editTimeEntry) {
      // Update handled separately if needed
      return;
    }
    createTimeEntry.mutate(
      {
        projectId: (data as any).project,
        data: {
          ...data,
          id: (data as any).id ?? "",
          title: (data as any).title ?? "",
          approved: (data as any).approved ?? false,
        },
      },
      {
        onSuccess: () => {
          setShowAddTimeModal(false);
          queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
        },
      }
    );
  };

  const handleDeleteTimeEntry = (projectId: string, timeEntryId: string) => {
    deleteTimeEntry.mutate(
      { projectId, timeEntryId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
        },
      }
    );
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
      createSubtask.mutate(
        {
          projectId: data.project,
          taskId: data.parentTaskId,
          data: subtaskData,
        },
        {
          onSuccess: () => {
            setShowAddTaskModal(false);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
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
        assignedTo: data.assignedTo ?? "",
        subtasks: [],
      };
      createTask.mutate(
        { projectId: data.project, data: taskData },
        {
          onSuccess: () => {
            setShowAddTaskModal(false);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
          },
        }
      );
    }
  };

  const handleAddDeliverable = (data: {
    project: string;
    date: string;
    description: string;
    notes?: string;
    status?: "pending" | "delivered" | "approved";
  }) => {
    createDeliverable.mutate(
      {
        projectId: data.project,
        data: {
          date: data.date,
          description: data.description,
          notes: data.notes,
          status: data.status || "pending",
          id: undefined,
        },
      },
      {
        onSuccess: () => {
          setShowAddDeliverableModal(false);
          queryClient.invalidateQueries({
            queryKey: ["deliverables", data.project],
          });
        },
      }
    );
  };

  const renderMainContent = () => {
    if (
      isEmployeeLoading ||
      isProjectsLoading ||
      isTasksLoading ||
      isTimeEntriesLoading
    ) {
      return <div>Loading...</div>;
    }

    if (employeeError || projectsError || tasksError || timeEntriesError) {
      return <div>Error loading data. Please try again.</div>;
    }

    if (!employee) {
      return <div>User not authenticated.</div>;
    }

    const filteredTasks = tasks.filter((task) => {
      const taskProjectId =
        typeof task.project === "string"
          ? task.project
          : (task.project && typeof task.project === "object" && "id" in task.project
              ? (task.project as { id?: string; _id?: string })._id || (task.project as { id?: string; _id?: string }).id || ""
              : "");
      return (
        (!priorityFilter || task.priority === priorityFilter) &&
        (!statusFilter || task.status === statusFilter) &&
        (!projectFilter || taskProjectId === projectFilter)
      );
    });

    const filteredTimeEntries = timeEntries.filter((entry) => {
      const entryProjectId =
        typeof entry.project === "string"
          ? entry.project
          : (entry.project && typeof entry.project === "object" && "_id" in entry.project
              ? (entry.project as { _id?: string; id?: string })._id || (entry.project as { _id?: string; id?: string }).id || ""
              : "");
      const entryUserId =
        typeof entry.user === "string"
          ? entry.user
          : entry.user?._id || (entry.user as any)?.id || "";
      return (
        entryUserId === getEmployeeId(employee) &&
        (!projectFilter || entryProjectId === projectFilter) &&
        (!dateFrom || new Date(entry.date) >= new Date(dateFrom)) &&
        (!dateTo || new Date(entry.date) <= new Date(dateTo))
      );
    });

    if (activeView.startsWith("project-")) {
      const projectId = activeView.split("project-")[1];
      const project = projects.find(
        (p) => p._id === projectId || p.id === projectId
      );
      if (!project) return <div>Project not found</div>;
      return (
        <ProjectDetailsView
          projects={[project]}
          deliverables={
            deliverables?.filter((d) => {
              const deliverableProjectId =
                typeof d.project === "string"
                  ? d.project
                  : (d.project && typeof d.project === "object" && "_id" in d.project
                      ? (d.project as { _id?: string; id?: string })._id || (d.project as { _id?: string; id?: string }).id || ""
                      : "");
              return deliverableProjectId === projectId;
            }) || []
          }
          employee={employee}
          onAddTask={(project) => {
            setSelectedProjectForTask(project);
            setShowAddTaskModal(true);
          }}
          onAddDeliverable={() => setShowAddDeliverableModal(true)}
          setActiveView={setActiveView}
        />
      );
    }

    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            employee={employee}
            projects={employeeProjects}
            tasks={filteredTasks}
            timeEntries={filteredTimeEntries}
            setActiveView={setActiveView}
            onAddTime={() => {
              setEditTimeEntry(undefined);
              setShowAddTimeModal(true);
            }}
          />
        );
      case "projects":
        return (
        <ProjectsView
          projects={employeeProjects}
          employee={employee}
          setActiveView={setActiveView}
          onAddTask={(project) => {
            setSelectedProjectForTask(project);
            setShowAddTaskModal(true);
          }}
        />
        );
      case "tasks":
        return (
          <TasksView
            tasks={filteredTasks}
            projects={employeeProjects}
            employee={employee}
            priorityFilter={priorityFilter}
            statusFilter={statusFilter}
            projectFilter={projectFilter}
            setPriorityFilter={setPriorityFilter}
            setStatusFilter={setStatusFilter}
            setProjectFilter={setProjectFilter}
            onAddTask={(project) => {
              setSelectedProjectForTask(project);
              setShowAddTaskModal(true);
            }}
          />
        );
      case "timesheets":
        return (
          <TimesheetsView
            timeEntries={filteredTimeEntries}
            projects={employeeProjects}
            projectFilter={projectFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
            setProjectFilter={setProjectFilter}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            onAddTime={() => {
              setEditTimeEntry(undefined);
              setShowAddTimeModal(true);
            }}
            onEditTime={(entry) => {
              setEditTimeEntry(entry);
              setShowAddTimeModal(true);
            }}
            onDeleteTime={handleDeleteTimeEntry}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        employee={
          employee || {
            _id: "",
            name: "",
            role: "employee",
            email: "",
            phone: "",
            grade: 0,
            designation: "",
            cnic: "",
            projects: [],
          }
        }
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 md:ml-64">
        <div className="p-6">
          <button
            className="md:hidden mb-4 p-2 bg-indigo-600 text-white rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close Menu" : "Open Menu"}
          </button>
          {renderMainContent()}
        </div>
      </div>
      {showAddTimeModal && (
        <AddTimeEntryModal
          projects={employeeProjects}
          employee={
            employee || {
              _id: "",
              name: "",
              role: "employee",
              email: "",
              phone: "",
              grade: 0,
              designation: "",
              cnic: "",
              projects: [],
            }
          }
          onSubmit={handleAddTimeEntry}
          onClose={() => setShowAddTimeModal(false)}
          initialData={editTimeEntry}
        />
      )}
      {showAddTaskModal && (
        <AddTaskModal
          projects={employeeProjects.filter((p) => {
            const teamLeadId =
              typeof p.teamLead === "string"
                ? p.teamLead
                : p.teamLead?._id || p.teamLead?.id;
            return teamLeadId === getEmployeeId(employee);
          })}
          selectedProject={selectedProjectForTask || undefined}
          employee={
            employee || {
              _id: "",
              name: "",
              role: "employee",
              email: "",
              phone: "",
              grade: 0,
              designation: "",
              cnic: "",
              projects: [],
            }
          }
          onSubmit={handleAddTask}
          onClose={() => {
            setShowAddTaskModal(false);
            setSelectedProjectForTask(null);
          }}
          tasks={tasks}
        />
      )}
      {showAddDeliverableModal && (
        <AddDeliverableModal
          projects={employeeProjects}
          employee={
            employee || {
              _id: "",
              name: "",
              role: "employee",
              email: "",
              phone: "",
              grade: 0,
              designation: "",
              cnic: "",
              projects: [],
            }
          }
          onSubmit={handleAddDeliverable}
          onClose={() => setShowAddDeliverableModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
