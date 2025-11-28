import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";
// Removed axios and uuid imports
import type { Employee } from "../../apis/authService"; // Assuming Employee type is correct here
import type { TimeEntry } from "../../types/timeEntry";
import type { Project } from "../../types/project";

interface AddTimeEntryModalProps {
  projects: Project[];
  employee: Employee; // Keep if needed for UI, but not for submit logic anymore
  // Corrected onSubmit type to match the data structure this component now sends
  onSubmit: (data: {
    projectId: string;
    data: Omit<
      TimeEntry,
      "_id" | "user" | "project" | "createdAt" | "updatedAt"
    >;
  }) => void;
  onClose: () => void;
  initialData?: TimeEntry;
  initialProject?: Project | null;
  isProjectDisabled?: boolean;
}

const AddTimeEntryModal: React.FC<AddTimeEntryModalProps> = ({
  projects,
  employee, // No longer used in submit
  onSubmit,
  onClose,
  initialData,
  initialProject,
  isProjectDisabled,
}) => {
  const [formData, setFormData] = useState({
    // Removed 'id' - backend handles this
    project:
      (initialData?.project as any)?._id || // Handle populated or ID project
      (initialData?.project as string) ||
      (initialProject?._id || (initialProject as any)?.id) ||
      "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0] // Format date correctly
      : new Date().toISOString().split("T")[0],
    hours: initialData?.hours !== undefined ? String(initialData.hours) : "",
    title: initialData?.title || "",
    note: initialData?.note || "",
    // Add 'task' if your modal includes a task selection
    // task: (initialData?.task as any)?._id || (initialData?.task as string) || "",
  });

  useEffect(() => {
    // Prevent background scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ***** CORRECTED handleSubmit: No longer makes API call *****
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Create the simple data object for the API body
    const apiData = {
      date: formData.date,
      hours: parseFloat(formData.hours || "0"),
      title: formData.title,
      note: formData.note,
      // Add 'task' field if it exists in your formData state
      // ...(formData.task && { task: formData.task }),
      // Include 'approved' status only if editing an existing entry
      ...(initialData && { approved: initialData.approved || false }),
    };

    // 2. Create the object structure the parent component (EmployeeDashboard) expects
    const dataForParent = {
      projectId: formData.project, // Project ID is separate
      data: apiData,               // The actual time entry data
    };

    // 3. Call the parent component's onSubmit function (handleAddTimeEntry)
    onSubmit(dataForParent);
    onClose(); // Close the modal after submitting
  };
  // ***** END OF CORRECTED handleSubmit *****

  // Modal JSX (no changes needed here)
  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-lg"
        style={{ WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}
        aria-hidden="true"
      />
      <div className="relative z-[10000] bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {initialData ? "Edit Time Entry" : "Add Time Entry"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-indigo-100 mt-1">Track your work hours and tasks</p>
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
              disabled={isProjectDisabled}
              className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${isProjectDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={(project as any)._id || (project as any).id} value={(project as any)._id || (project as any).id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                Hours
              </label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                step="0.25"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
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
              Notes
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              rows={3}
              placeholder="Add details about the task..."
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
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default AddTimeEntryModal;