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
import EmployeeProfile from "../../components/EmployeeProfile/EmployeeProfile";
import { useCurrentUser } from "../../apis/authService";
import { useGetProjects } from "../../hooks/useProject";
import { useGetAllTasks } from "../../hooks/useTask";
import { useGetAllTimeEntries } from "../../hooks/useTimeEntry";
import { useGetDeliverables } from "../../hooks/useDeliverable";
import { useCreateTask, useCreateSubtask } from "../../hooks/useTask";
import {
  useCreateTimeEntry,
  useDeleteTimeEntry,
  useUpdateTimeEntry,
} from "../../hooks/useTimeEntry";
import type { Task, Subtask } from "../../types/task";
import type { TimeEntry } from "../../types/timeEntry";
import type { Project } from "../../types/project";
import type { User } from "../../apis/authService";

// Helper functions (no changes needed)
const getEmployeeId = (employee: User | null | undefined): string => {
  if (!employee) return "";
  return (employee as any).id || employee._id || "";
};
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
  const [editTimeEntry, setEditTimeEntry] = useState<TimeEntry | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const queryClient = useQueryClient();

  // Data fetching hooks (no changes needed)
  const { data: employee, isLoading: isEmployeeLoading, error: employeeError } = useCurrentUser();
  const { data: projectsData, isLoading: isProjectsLoading, error: projectsError } = useGetProjects();
  const projects = projectsData?.projects || [];
  const { data: tasksData, isLoading: isTasksLoading, error: tasksError } = useGetAllTasks({
    projectId: projectFilter || undefined,
    priority: priorityFilter || undefined,
    status: statusFilter || undefined,
  });
  const tasks = tasksData?.tasks || [];
  const { data: timeEntriesData, isLoading: isTimeEntriesLoading, error: timeEntriesError } = useGetAllTimeEntries({
    projectId: projectFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });
  const timeEntries = timeEntriesData?.timeEntries || [];
  const projectId = activeView.startsWith("project-") ? activeView.split("project-")[1] : "";
  const { data: deliverables, isLoading: isDeliverablesLoading, error: deliverablesError } = useGetDeliverables(projectId, {
    enabled: !!projectId,
  });

  // Mutations (no changes needed)
  const createTimeEntry = useCreateTimeEntry();
  const updateTimeEntry = useUpdateTimeEntry();
  const deleteTimeEntry = useDeleteTimeEntry();
  const createTask = useCreateTask();
  const createSubtask = useCreateSubtask();

  // Employee project filtering (no changes needed)
  const employeeProjects = projects.filter((project: Project) => {
    const employeeId = getEmployeeId(employee);
    if (!employeeId) return false;
    const teamLeadId = typeof project.teamLead === "string" ? project.teamLead : project.teamLead?._id || project.teamLead?.id;
    const teamMemberIds = project.teamMembers.map((member) => typeof member === "string" ? member : member._id || member.id);
    const projectIds = getEmployeeProjects(employee);
    return teamMemberIds.includes(employeeId) || teamLeadId === employeeId || projectIds.includes((project._id || project.id || "").toString());
  });

  // Debugging useEffects (can be removed if not needed)
  useEffect(() => {
    if (employee && projects.length > 0) {
      console.log("Employee ID:", employee.id);
      const teamLeadProjects = projects.filter((p) => {
        const teamLeadId = typeof p.teamLead === "string" ? p.teamLead : p.teamLead?._id || p.teamLead?.id;
        return teamLeadId === employee.id;
      });
      console.log("Team Lead Projects Count:", teamLeadProjects.length);
    }
  }, [employee, projects]);
  useEffect(() => {
    console.log("Project updated in EmployeeDashboard:", projectsData);
    console.log("Employee:", employee);
    console.log("EmployeeProjects:", employeeProjects);
    if (projects.length > 0 && employee) {
      projects.forEach((project: Project) => {
        const teamLeadId = typeof project.teamLead === "string" ? project.teamLead : project.teamLead?._id || project.teamLead?.id;
        const teamMemberIds = project.teamMembers.map((member) => typeof member === "string" ? member : member._id || member.id);
        console.log("Filtering project:", {
          projectId: project._id || project.id,
          projectName: project.name,
          teamLeadId,
          teamMemberIds,
          employeeId: getEmployeeId(employee),
          employeeProjects: getEmployeeProjects(employee),
          isIncluded: employeeProjects.some((p) => p._id === project._id || p.id === project.id),
        });
      });
    }
  }, [projectsData, employee, employeeProjects]);

  // ***** CORRECTED handleAddTimeEntry *****
  // Changed the type annotation of 'data' to match what the modal now sends
  const handleAddTimeEntry = (formData: {
    projectId: string;
    data: Omit< // Ensure this type matches what the modal sends and the hook expects
      TimeEntry,
      "_id" | "user" | "project" | "createdAt" | "updatedAt"
    >;
  }) => {
    const forceRefresh = async () => {
      try {
        queryClient.invalidateQueries();
        await queryClient.refetchQueries({ predicate: () => true });
      } catch (err) {
        console.error("Error forcing refetch after time entry mutation:", err);
        try {
          queryClient.invalidateQueries();
        } catch {
          /* ignore */
        }
      }
    };

    if (editTimeEntry) {
      const entryId = editTimeEntry._id || (editTimeEntry as any).id;
      const fallbackProjectId =
        (typeof editTimeEntry.project === "string"
          ? editTimeEntry.project
          : editTimeEntry.project?._id || (editTimeEntry.project as any)?.id) || "";

      if (!entryId) {
        console.error("Missing time entry id for update");
        return;
      }

      updateTimeEntry.mutate(
        {
          projectId: formData.projectId || fallbackProjectId,
          timeEntryId: entryId,
          data: formData.data,
        },
        {
          onSuccess: async () => {
            setShowAddTimeModal(false);
            setEditTimeEntry(undefined);
            await forceRefresh();
          },
        }
      );
      return;
    }

    createTimeEntry.mutate(
      {
        projectId: formData.projectId,
        data: formData.data,
      },
      {
        onSuccess: async () => {
          setShowAddTimeModal(false);
          setEditTimeEntry(undefined);
          await forceRefresh();
        },
        onError: (error) => {
          console.error("Mutation error handled by hook:", error);
        },
      }
    );
  };
  // ***** END OF CORRECTED handleAddTimeEntry *****

  // Other handlers (no changes needed)
  const handleDeleteTimeEntry = (projectId: string, timeEntryId: string) => {
    deleteTimeEntry.mutate(
      { projectId, timeEntryId },
      {
        onSuccess: () => {
          // Hook handles invalidation
        },
      }
    );
  };
  const handleAddTask = (data: {
    title: string; description?: string; project: string; assignedTo?: string;
    priority: "urgent" | "high" | "medium" | "low"; status: "todo" | "in_progress" | "done";
    dueDate?: string; isSubtask?: boolean; parentTaskId?: string;
  }) => {
    if (data.isSubtask && data.parentTaskId) {
      const subtaskData: Omit<Subtask, "_id" | "createdAt" | "updatedAt"> = {
        title: data.title, status: data.status, priority: data.priority,
        assignees: data.assignedTo ? [data.assignedTo] : [],
      };
      createSubtask.mutate(
        { projectId: data.project, taskId: data.parentTaskId, data: subtaskData },
        { onSuccess: () => { setShowAddTaskModal(false); /* Hook handles invalidation */ } }
      );
    } else {
      const taskData: Omit<Task, "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"> = {
        title: data.title, description: data.description, priority: data.priority,
        status: data.status, dueDate: data.dueDate, assignedTo: data.assignedTo ?? "", subtasks: [],
      };
      createTask.mutate(
        { projectId: data.project, data: taskData },
        { onSuccess: () => { setShowAddTaskModal(false); /* Hook handles invalidation */ } }
      );
    }
  };

  // Render function (no changes needed)
  const renderMainContent = () => {
    if (isEmployeeLoading || isProjectsLoading || isTasksLoading || isTimeEntriesLoading) {
      return <div>Loading...</div>;
    }
    if (employeeError || projectsError || tasksError || timeEntriesError) {
      return <div>Error loading data. Please try again.</div>;
    }
    if (!employee) {
      return <div>User not authenticated.</div>;
    }

    // Filtering logic (no changes needed)
    const filteredTasks = tasks.filter((task) => {
      const taskProjectId = typeof task.project === "string" ? task.project : task.project?._id || task.project?.id || "";
      return (!priorityFilter || task.priority === priorityFilter) && (!statusFilter || task.status === statusFilter) && (!projectFilter || taskProjectId === projectFilter);
    });
    const filteredTimeEntries = timeEntries.filter((entry) => {
      const entryProjectId = typeof entry.project === "string" ? entry.project : entry.project?._id || entry.project?.id || "";
      const entryUserId = typeof entry.user === "string" ? entry.user : entry.user?._id || (entry.user as any)?.id || "";
      return entryUserId === getEmployeeId(employee) && (!projectFilter || entryProjectId === projectFilter) && (!dateFrom || new Date(entry.date) >= new Date(dateFrom)) && (!dateTo || new Date(entry.date) <= new Date(dateTo));
    });

    // View rendering logic (no changes needed)
    if (activeView.startsWith("project-")) {
      const project = projects.find((p) => p._id === projectId || p.id === projectId);
      if (!project) return <div>Project not found</div>;
      return (
        <ProjectDetailsView
          projects={[project]}
          deliverables={deliverables?.filter((d) => {
            const deliverableProjectId = typeof d.project === "string" ? d.project : d.project?._id || d.project?.id || "";
            return deliverableProjectId === projectId;
          }) || []}
          employee={employee}
          onAddTask={(project) => { setSelectedProjectForTask(project); setShowAddTaskModal(true); }}
          onAddDeliverable={() => setShowAddDeliverableModal(true)}
          setActiveView={setActiveView}
          onAddTime={handleAddTimeEntry}   // <-- ADDED: pass parent's handler so ProjectDetails calls mutation
        />
      );
    }
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            employee={employee} projects={employeeProjects} tasks={filteredTasks}
            timeEntries={filteredTimeEntries} setActiveView={setActiveView}
            onAddTime={() => { setEditTimeEntry(undefined); setShowAddTimeModal(true); }}
          />
        );
      case "projects":
        return (
          <ProjectsView
            projects={employeeProjects} employee={employee} setActiveView={setActiveView}
            onAddTask={(project) => { setSelectedProjectForTask(project || null); setShowAddTaskModal(true); }}
            onAddDeliverable={() => { /* See original comment */ }}
          />
        );
      case "tasks":
        return (
          <TasksView
            tasks={filteredTasks} projects={employeeProjects} employee={employee}
            priorityFilter={priorityFilter} statusFilter={statusFilter} projectFilter={projectFilter}
            setPriorityFilter={setPriorityFilter} setStatusFilter={setStatusFilter} setProjectFilter={setProjectFilter}
            onAddTask={(project) => { setSelectedProjectForTask(project); setShowAddTaskModal(true); }}
          />
        );
      case "timesheets":
        return (
          <TimesheetsView
            timeEntries={filteredTimeEntries} projects={employeeProjects} projectFilter={projectFilter}
            dateFrom={dateFrom} dateTo={dateTo} setProjectFilter={setProjectFilter}
            setDateFrom={setDateFrom} setDateTo={setDateTo}
            onAddTime={() => { setEditTimeEntry(undefined); setShowAddTimeModal(true); }}
            onEditTime={(entry) => { setEditTimeEntry(entry); setShowAddTimeModal(true); }}
            onDeleteTime={handleDeleteTimeEntry}
          />
        );
      case "profile":
        return <EmployeeProfile />;
      default: return null;
    }
  };

  // Fallback employee (no changes needed)
  const fallbackEmployee: User = {
    _id: "", name: "", role: "employee", email: "", phone: "", grade: 0, designation: "", cnic: "", projects: [],
  };

  // Main component return (JSX, no changes needed)
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        employee={employee || fallbackEmployee} activeView={activeView} setActiveView={setActiveView}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
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
      {/* Modals (no changes needed) */}
      {showAddTimeModal && (
        <AddTimeEntryModal
          projects={employeeProjects}
          employee={employee || fallbackEmployee}
          // The corrected onSubmit prop is passed here
          onSubmit={handleAddTimeEntry}
          onClose={() => { setShowAddTimeModal(false); setEditTimeEntry(undefined); }} // Also clear edit state on close
          initialData={editTimeEntry}
        />
      )}
      {showAddTaskModal && (
        <AddTaskModal
          projects={selectedProjectForTask ? employeeProjects.filter((p) => {
            const teamLeadId = typeof p.teamLead === "string" ? p.teamLead : p.teamLead?._id || p.teamLead?.id;
            return teamLeadId === getEmployeeId(employee);
          }) : employeeProjects}
          selectedProject={selectedProjectForTask || undefined}
          employee={employee || fallbackEmployee}
          onSubmit={handleAddTask}
          onClose={() => { setShowAddTaskModal(false); setSelectedProjectForTask(null); }}
          tasks={tasks} // Pass tasks for parent task selection if adding subtask
          isProjectDisabled={!!selectedProjectForTask}
        />
      )}
      {showAddDeliverableModal && (
        <AddDeliverableModal
          projectId={projectId} // Use the projectId derived from activeView
          employee={employee || fallbackEmployee}
          onClose={() => setShowAddDeliverableModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
