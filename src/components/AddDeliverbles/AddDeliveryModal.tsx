// import React, { useState } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { useCreateDeliverable } from "../../hooks/useDeliverable"; // Adjust path
// import { useGetDeliverables } from "../../hooks/useDeliverable"; // Adjust path
// import type { Deliverable } from "../../types/deliverable";
// import type { Employee } from "../../apis/authService"; // Adjust path
// import { FiX } from "react-icons/fi";

// interface AddDeliverableModalProps {
//   projectId: string;
//   employee: Employee | null; // Allow null to handle missing employee
//   onClose: () => void;
// }
// const AddDeliverableModal: React.FC<AddDeliverableModalProps> = ({
//   projectId,
//   employee,
//   onClose,
// }) => {
//   const [date, setDate] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [parent, setParent] = useState<string | undefined>(undefined);
//   const [error, setError] = useState<string | null>(null);

//   const queryClient = useQueryClient();
//   const { mutate: createDeliverable, isPending } = useCreateDeliverable();
//   const { data: existingDeliverables = [], isLoading: isDeliverablesLoading } =
//     useGetDeliverables(projectId, {
//       enabled: !!projectId,
//     });

//   const handleSubmit = (e: React.FormFormEvent) => {
//     e.preventDefault();
//     console.log("Submitting new deliverable for projectId:", projectId);

//     if (!projectId) {
//       console.error("Project ID is undefined");
//       setError("Project ID is missing");
//       return;
//     }

//     if (!employee || (!employee._id && !employee.id)) {
//       console.error("Employee data is invalid or missing", { employee });
//       setError(
//         "User authentication is required to create a deliverable. Please log in."
//       );
//       return;
//     }

//     const data: Omit<
//       Deliverable,
//       "_id" | "id" | "project" | "createdAt" | "updatedAt"
//     > = {
//       date,
//       description,
//       notes,
//       status: "pending",
//       parent,
//       createdBy: employee._id || employee.id,
//     };
//     console.log("Deliverable data:", data);

//     createDeliverable(
//       { projectId, data },
//       {
//         onSuccess: () => {
//           console.log("Deliverable created successfully");
//           queryClient.invalidateQueries({
//             queryKey: ["deliverables", projectId],
//           });
//           setError(null);
//           setDate("");
//           setDescription("");
//           setNotes("");
//           setParent(undefined);
//           onClose();
//         },
//         onError: (error: any) => {
//           console.error("Failed to create deliverable:", {
//             message: error.message,
//             details: error.response?.data || error,
//           });
//           setError(
//             error.response?.data?.message ||
//               "Failed to create deliverable. Please try again."
//           );
//         },
//       }
//     );
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white sticky top-0 z-10">
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg sm:text-xl font-semibold">
//               Add Deliverable
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-white hover:text-gray-200 transition-colors"
//             >
//               <FiX size={24} />
//             </button>
//           </div>
//           <p className="text-indigo-100 mt-1 text-sm sm:text-base">
//             Fill in the details to add a new deliverable
//           </p>
//         </div>
//         <form
//           onSubmit={handleSubmit}
//           className="p-4 sm:p-6 space-y-4 sm:space-y-5"
//         >
//           {error && (
//             <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm sm:text-base">
//               {error}
//             </div>
//           )}
//           {isDeliverablesLoading && (
//             <div className="text-center text-gray-500 text-sm sm:text-base">
//               Loading deliverables...
//             </div>
//           )}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Due Date
//             </label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Notes
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
//               rows={3}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Link to Previous Deliverable (for revisions)
//             </label>
//             <select
//               value={parent || ""}
//               onChange={(e) => setParent(e.target.value || undefined)}
//               className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
//               disabled={isDeliverablesLoading}
//             >
//               <option value="">None</option>
//               {existingDeliverables.map((del) => (
//                 <option
//                   key={String(del._id || del.id)}
//                   value={String(del._id || del.id)}
//                 >
//                   {del.description} (Due:{" "}
//                   {new Date(del.date).toLocaleDateString()})
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 sm:px-5 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={
//                 isPending ||
//                 !employee ||
//                 (!employee._id && !employee.id) ||
//                 isDeliverablesLoading
//               }
//               className="px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
//             >
//               {isPending ? "Adding..." : "Add Deliverable"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddDeliverableModal;
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateDeliverable } from "../../hooks/useDeliverable"; // Adjust path
import { useGetDeliverables } from "../../hooks/useDeliverable"; // Adjust path
import type { Deliverable } from "../../types/deliverable";
import type { Employee } from "../../apis/authService"; // Adjust path
import { FiX } from "react-icons/fi";

interface AddDeliverableModalProps {
  projectId: string; // Corrected: Now expects projectId
  employee: Employee | null; // Allow null to handle missing employee
  onClose: () => void;
}

const AddDeliverableModal: React.FC<AddDeliverableModalProps> = ({
  projectId,
  employee,
  onClose,
}) => {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [parent, setParent] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutate: createDeliverable, isPending } = useCreateDeliverable();
  const { data: existingDeliverables = [], isLoading: isDeliverablesLoading } =
    useGetDeliverables(projectId, {
      enabled: !!projectId,
    });

  // FIXED: Corrected event type from React.FormFormEvent to React.FormEvent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new deliverable for projectId:", projectId);

    if (!projectId) {
      console.error("Project ID is undefined");
      setError("Project ID is missing");
      return;
    }

    // This check is still valid for ensuring a user is logged in
    if (!employee || (!employee._id && !employee.id)) {
      console.error("Employee data is invalid or missing", { employee });
      setError(
        "User authentication is required to create a deliverable. Please log in."
      );
      return;
    }

    // FIXED: Removed `createdBy`. This is now handled securely by the backend.
    // The Omit type in the hook/service already reflected this.
    const data: Omit<
      Deliverable,
      "_id" | "id" | "project" | "createdBy" | "createdAt" | "updatedAt"
    > = {
      date,
      description,
      notes,
      status: "pending",
      parent,
    };
    console.log("Deliverable data:", data);

    createDeliverable(
      { projectId, data },
      {
        onSuccess: () => {
          console.log("Deliverable created successfully");
          queryClient.invalidateQueries({
            queryKey: ["deliverables", projectId],
          });
          setError(null);
          setDate("");
          setDescription("");
          setNotes("");
          setParent(undefined);
          onClose();
        },
        onError: (error: any) => {
          console.error("Failed to create deliverable:", {
            message: error.message,
            details: error.response?.data || error,
          });
          setError(
            error.response?.data?.message ||
              "Failed to create deliverable. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold">
              Add Deliverable
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-indigo-100 mt-1 text-sm sm:text-base">
            Fill in the details to add a new deliverable
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}
          {isDeliverablesLoading && (
            <div className="text-center text-gray-500 text-sm sm:text-base">
              Loading deliverables...
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link to Previous Deliverable (for revisions)
            </label>
            <select
              value={parent || ""}
              onChange={(e) => setParent(e.target.value || undefined)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              disabled={isDeliverablesLoading}
            >
              <option value="">None</option>
              {existingDeliverables.map((del) => (
                <option
                  key={String(del._id || del.id)}
                  value={String(del._id || del.id)}
                >
                  {del.description} (Due:{" "}
                  {new Date(del.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-5 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isPending ||
                !employee ||
                (!employee._id && !employee.id) ||
                isDeliverablesLoading
              }
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              {isPending ? "Adding..." : "Add Deliverable"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeliverableModal;