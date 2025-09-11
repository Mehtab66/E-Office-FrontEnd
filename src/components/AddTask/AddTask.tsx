import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import type { Employee } from "../../apis/authService";
import type { Task } from "../../types/task";
import type { Project } from "../../types/project";

interface AddTaskModalProps {
  projects: Project[];
  employee: Employee;
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
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  projects,
  employee,
  onSubmit,
  onClose,
  tasks,
}) => {
  const [formData, setFormData] = useState({
    project: "",
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium" as "urgent" | "high" | "medium" | "low",
    status: "todo" as "todo" | "in_progress" | "done",
    dueDate: "",
    isSubtask: false,
    parentTaskId: "",
  });
  const [teamMembers, setTeamMembers] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    if (formData.project) {
      const project = projects.find(
        (p) => p.id === formData.project || p._id === formData.project
      );
      if (project) {
        const members = project.teamMembers.map((member: any) =>
          typeof member === "string"
            ? { id: member, name: `Member ${member.substring(0, 5)}` }
            : {
                id: member._id || member.id,
                name: member.name || `Member ${member._id?.substring(0, 5)}`,
              }
        );
        const lead =
          typeof project.teamLead === "string"
            ? {
                id: project.teamLead,
                name: `Team Lead ${project.teamLead.substring(0, 5)}`,
              }
            : {
                id: project.teamLead._id || project.teamLead.id,
                name:
                  project.teamLead.name ||
                  `Team Lead ${project.teamLead._id?.substring(0, 5)}`,
              };
        setTeamMembers([...members, lead]);
      }
    }
  }, [formData.project, projects]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      description: formData.description,
      project: formData.project,
      assignedTo: formData.isSubtask ? undefined : formData.assignedTo,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || undefined,
      isSubtask: formData.isSubtask,
      parentTaskId: formData.isSubtask ? formData.parentTaskId : undefined,
    };
    onSubmit(data);
    onClose();
  };

  const parentTasks =
    tasks?.filter(
      (task) =>
        (task.project === formData.project ||
          (typeof task.project === "object" &&
            task.project._id === formData.project)) &&
        !formData.isSubtask
    ) || [];

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold">Add Task</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-indigo-100 mt-1 text-sm sm:text-base">
            Fill in the details to add a new task
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
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
                <option
                  key={project.id || project._id}
                  value={project.id || project._id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSubtask"
              name="isSubtask"
              checked={formData.isSubtask}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isSubtask"
              className="ml-2 block text-sm text-gray-700"
            >
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
                {parentTasks.map((task) => (
                  <option key={task.id || task._id} value={task.id || task._id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              rows={3}
              placeholder="Add details about the task..."
            />
          </div>

          {!formData.isSubtask && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Team Member
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                required={!formData.isSubtask}
              >
                <option value="">Select a team member</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
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
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
