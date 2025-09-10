import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import type { Employee } from "../../apis/authService";
import type { Project } from "../../types/project";
interface AddDeliverableModalProps {
  projects: Project[];
  employee: Employee;
  onSubmit: (data: {
    project: string;
    date: string;
    description: string;
  }) => void;
  onClose: () => void;
}

const AddDeliverableModal: React.FC<AddDeliverableModalProps> = ({
  projects,
  employee,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    project: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

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
      project: formData.project,
      date: formData.date,
      description: formData.description,
    };
    try {
      await axios.post(`/api/projects/${formData.project}/deliverables`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error saving deliverable:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add Deliverable</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-indigo-100 mt-1">
            Add notes to track project progress
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              rows={4}
              placeholder="Add details about the deliverable..."
              required
            />
          </div>
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
              Save Deliverable
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeliverableModal;
