// import React, { useState } from "react";
// import { FiX } from "react-icons/fi";
// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";
// import type { Employee } from "../../apis/authService";
// import type { TimeEntry } from "../../types/timeEntry";
// import type { Project } from "../../types/project";
// interface AddTimeEntryModalProps {
//   projects: Project[];
//   employee: Employee;
//   onSubmit: (data: TimeEntry) => void;
//   onClose: () => void;
//   initialData?: TimeEntry;
// }

// const AddTimeEntryModal: React.FC<AddTimeEntryModalProps> = ({
//   projects,
//   employee,
//   onSubmit,
//   onClose,
//   initialData,
// }) => {
//   const [formData, setFormData] = useState({
//     id: initialData?.id || "",
//     project: initialData?.project || "",
//     date: initialData?.date || new Date().toISOString().split("T")[0],
//     hours: initialData?.hours.toString() || "",
//     title: initialData?.title || "",
//     note: initialData?.note || "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const data: TimeEntry = {
//         id: formData.id || uuidv4(),
//         user: employee,
//         project: formData.project,
//         date: formData.date,
//         hours: parseFloat(formData.hours),
//         title: formData.title,
//         note: formData.note,
//         approved: initialData?.approved || false,
//         _id: "",
//         createdAt: "",
//         updatedAt: ""
//     };
//     try {
//       if (initialData) {
//         await axios.put(
//           `/api/projects/${formData.project}/time-entries/${data.id}`,
//           data,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//       } else {
//         await axios.post(
//           `/api/projects/${formData.project}/time-entries`,
//           data,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//       }
//       onSubmit(data);
//       onClose();
//     } catch (error) {
//       console.error("Error saving time entry:", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0  bg-opacity-60  flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">
//               {initialData ? "Edit Time Entry" : "Add Time Entry"}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-white hover:text-gray-200 transition-colors"
//             >
//               <FiX size={24} />
//             </button>
//           </div>
//           <p className="text-indigo-100 mt-1">
//             Track your work hours and tasks
//           </p>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6 space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Project
//             </label>
//             <select
//               name="project"
//               value={formData.project}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//               required
//             >
//               <option value="">Select a project</option>
//               {projects.map((project) => (
//                 <option key={project.id} value={project.id}>
//                   {project.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date
//               </label>
//               <input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Hours
//               </label>
//               <input
//                 type="number"
//                 name="hours"
//                 value={formData.hours}
//                 onChange={handleChange}
//                 step="0.25"
//                 min="0"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Task Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Notes
//             </label>
//             <textarea
//               name="note"
//               value={formData.note}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//               rows={3}
//               placeholder="Add details about the task..."
//             />
//           </div>
//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
//             >
//               Save Entry
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTimeEntryModal;
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { Employee } from "../../apis/authService";
import type { TimeEntry } from "../../types/timeEntry";
import type { Project } from "../../types/project";

interface AddTimeEntryModalProps {
  projects: Project[];
  employee: Employee;
  onSubmit: (data: TimeEntry) => void;
  onClose: () => void;
  initialData?: TimeEntry;
}

const AddTimeEntryModal: React.FC<AddTimeEntryModalProps> = ({
  projects,
  employee,
  onSubmit,
  onClose,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    project: initialData?.project || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    hours: (initialData?.hours !== undefined ? String(initialData.hours) : ""),
    title: initialData?.title || "",
    note: initialData?.note || "",
  });

  useEffect(() => {
    // prevent background scroll while modal is open
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: TimeEntry = {
      id: formData.id || uuidv4(),
      user: employee,
      project: formData.project,
      date: formData.date,
      hours: parseFloat(formData.hours || "0"),
      title: formData.title,
      note: formData.note,
      approved: initialData?.approved || false,
      _id: initialData?._id || "",
      createdAt: initialData?.createdAt || "",
      updatedAt: initialData?.updatedAt || "",
    };
    try {
      if (initialData) {
        await axios.put(
          `/api/projects/${formData.project}/time-entries/${data.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `/api/projects/${formData.project}/time-entries`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error saving time entry:", error);
    }
  };

  // Modal JSX (backdrop + card). Portal it to document.body so blur + z-index are reliable.
  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop: absolute full-screen layer that blurs the background.
          - `bg-black/30` provides dimming but remains transparent so blur is visible.
          - Inline style fallback for browsers / older Tailwind configs.
      */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-lg"
        style={{ WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}
        aria-hidden="true"
      />

      {/* Modal card above backdrop */}
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
