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
      const project = projects.find((p) => p.id === formData.project);
      if (project) {
        setTeamMembers([
          ...project.teamMembers.map((member: any) =>
            typeof member === "string"
              ? { id: member, name: member }
              : { id: member.id, name: member.name }
          ),
          typeof project.teamLead === "string"
            ? { id: project.teamLead, name: project.teamLead }
            : {
                id: (project.teamLead as { id: string; name: string }).id,
                name: (project.teamLead as { id: string; name: string }).name,
              },
        ]);
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

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add Task</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-indigo-100 mt-1">
            Fill in the details to add a new task
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Add your form fields here, similar to AddDeliverableModal */}
          {/* Example: */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              rows={4}
              placeholder="Add details about the task..."
            />
          </div>
          {/* Add more fields as needed */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
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
