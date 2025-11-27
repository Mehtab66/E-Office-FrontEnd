import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";
import type { Employee } from "../../apis/authService";
import type { Task } from "../../types/task";
import type { Project } from "../../types/project";

interface AddTaskModalProps {
  projects: Project[];
  employee: Employee;
  selectedProject?: Project;
  editingTask?: Task | null;
  onSubmit: (data: {
    title: string;
    description?: string;
    project: string;
    assignedTo?: string;
    priority: "urgent" | "high" | "medium" | "low";
    status: "todo" | "in_progress" | "done";
    dueDate?: string;
    isSubtask?: boolean;
    parentTaskId?: string;
  }) => void;
  onClose: () => void;
  tasks?: Task[];
  onChangeProject?: (projectId: string) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  projects,
  employee,
  selectedProject,
  editingTask,
  onSubmit,
  onClose,
  tasks = [],
  onChangeProject,
}) => {
  const [formData, setFormData] = useState({
    project: editingTask
      ? (editingTask.project || "")
      : (selectedProject ? (selectedProject._id || (selectedProject as any).id || "") : ""),
    title: editingTask ? editingTask.title : "",
    description: editingTask ? editingTask.description || "" : "",
    assignedTo: editingTask
      ? (typeof editingTask.assignedTo === "string"
        ? editingTask.assignedTo
        : (editingTask.assignedTo as any)?._id || "")
      : "",
    priority: (editingTask ? editingTask.priority : "medium") as "urgent" | "high" | "medium" | "low",
    status: (editingTask ? editingTask.status : "todo") as "todo" | "in_progress" | "done",
    dueDate: editingTask
      ? (editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split("T")[0] : "")
      : "",
    isSubtask: false,
    parentTaskId: "",
  });

  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string }[]>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Update team members when project changes
  useEffect(() => {
    const projectToUse = selectedProject || projects.find(
      (p) => p.id === formData.project || p._id === formData.project
    );

    if (projectToUse) {
      const members = (projectToUse.teamMembers || []).map((member: any) =>
        typeof member === "string"
          ? { id: member, name: `Member ${member.substring(0, 5)}` }
          : {
            id: member._id || member.id,
            name: member.name || `Member ${member._id?.substring(0, 5)}`,
          }
      );

      const lead =
        typeof projectToUse.teamLead === "string"
          ? {
            id: projectToUse.teamLead,
            name: `Team Lead ${projectToUse.teamLead.substring(0, 5)}`,
          }
          : {
            id: (projectToUse.teamLead as any)?._id || (projectToUse.teamLead as any)?.id,
            name: (projectToUse.teamLead as any)?.name || `Team Lead ${(projectToUse.teamLead as any)?._id?.substring(0, 5)}`,
          };

      const allMembers = [...members, lead].filter(Boolean);
      const uniqueMembers = [...new Map(allMembers.map((m) => [m.id, m])).values()];
      setTeamMembers(uniqueMembers);
    } else {
      setTeamMembers([]);
    }
  }, [selectedProject, formData.project, projects]);

  // Prevent background scroll and handle ESC key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If the project dropdown changed, notify the parent
    if (name === "project" && onChangeProject) {
      onChangeProject(value);
      // Also reset parent task selection when project changes
      setFormData((prev) => ({ ...prev, parentTaskId: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked, parentTaskId: checked ? prev.parentTaskId : "" })); // Reset parent task if unchecked
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      description: formData.description,
      project: formData.project,
      // Assign for both task and subtask
      assignedTo: formData.assignedTo,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || undefined,
      isSubtask: formData.isSubtask,
      parentTaskId: formData.isSubtask ? formData.parentTaskId : undefined,
    };
    onSubmit(data);
    // Don't call onClose() here, let the parent handle it on success
  };

  // Get current project ID
  const currentProjectId = selectedProject
    ? (selectedProject._id || (selectedProject as any).id)
    : formData.project;

  // Filter parent tasks - uses the 'tasks' prop passed from ManagerDashboard
  const parentTasks = tasks.filter((task) => {
    const taskProjectId = typeof task.project === "string"
      ? task.project
      : (task.project as any)?._id;

    // Match project and ensure it's not itself a subtask
    return taskProjectId === currentProjectId && !(task as any).parentTaskId && task._id !== editingTask?._id;
  });

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const modal = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-[10000] bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white sticky top-0 z-20 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold">
              {editingTask ? "Edit Task" : "Add Task"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-indigo-100 mt-1 text-sm sm:text-base">
            {editingTask ? "Update the task details below" : "Fill in the details to add a new task"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {selectedProject ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Project
              </label>
              <div className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm sm:text-base">
                {selectedProject.name}
              </div>
              {/* Hidden input to ensure project ID is included in form data even when disabled */}
              <input type="hidden" name="project" value={formData.project} />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={(project as any).id || project._id} value={(project as any).id || project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSubtask"
              name="isSubtask"
              checked={formData.isSubtask}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isSubtask" className="ml-2 block text-sm text-gray-700">
              This is a subtask
            </label>
          </div>

          {formData.isSubtask && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Task
              </label>
              <select
                name="parentTaskId"
                value={formData.parentTaskId}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                required={formData.isSubtask}
              >
                <option value="">Select a parent task</option>
                {parentTasks.length === 0 && formData.project ? (
                  <option value="" disabled>
                    No parent tasks found for this project
                  </option>
                ) : (
                  parentTasks.map((task) => (
                    <option key={(task as any).id || task._id} value={(task as any).id || task._id}>
                      {task.title}
                    </option>
                  ))
                )}
              </select>
              {parentTasks.length === 0 && formData.project && (
                <p className="mt-1 text-sm text-amber-600">
                  No parent tasks found. Please create a main task first.
                </p>
              )}
              {!formData.project && (
                <p className="mt-1 text-sm text-gray-500">
                  Please select a project first.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              rows={3}
              placeholder="Add details about the task..."
            />
          </div>

          {/* Show 'Assign To' for both Tasks and Subtasks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Team Member
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
            >
              <option value="">Select a team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              required
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-5 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-sm sm:text-base"
            >
              {editingTask ? "Update Task" : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default AddTaskModal;