// // hooks/useDeliverable.ts (updated with invalidateQueries)
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import {
//   createDeliverable,
//   getDeliverables,
//   getDeliverable,
//   updateDeliverable,
//   deleteDeliverable,
// } from "../apis/deliverableService";
// import type { Deliverable } from "../types/deliverable";

// export const useCreateDeliverable = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       projectId,
//       data,
//     }: {
//       projectId: string;
//       data: Omit<
//         Deliverable,
//         "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"
//       >;
//     }) => {
//       console.log("Calling createDeliverable with:", { projectId, data });
//       return createDeliverable(projectId, data);
//     },
//     onSuccess: (_data: Deliverable, variables) => {
//       console.log("Deliverable created successfully:", _data);
//       queryClient.invalidateQueries({
//         queryKey: ["deliverables", variables.projectId],
//       });
//       toast.success("Deliverable created successfully!");
//     },
//     onError: (error: any) => {
//       console.error("Failed to create deliverable:", {
//         message: error.message,
//         details: error.response?.data || error,
//       });
//       toast.error(`Failed to create deliverable: ${error.message}`);
//     },
//   });
// };
// export const useGetDeliverables = (
//   projectId: string,
//   options: { enabled: boolean }
// ) => {
//   return useQuery({
//     queryKey: ["deliverables", projectId],
//     queryFn: () => getDeliverables(projectId),
//     enabled: !!projectId && options.enabled,
//   });
// };

// export const useGetDeliverable = (projectId: string, deliverableId: string) => {
//   return useQuery({
//     queryKey: ["deliverable", projectId, deliverableId],
//     queryFn: () => getDeliverable(projectId, deliverableId),
//     enabled: !!projectId && !!deliverableId,
//   });
// };

// export const useUpdateDeliverable = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       projectId,
//       deliverableId,
//       data,
//     }: {
//       projectId: string;
//       deliverableId: string;
//       data: Partial<Deliverable>;
//     }) => updateDeliverable(projectId, deliverableId, data),
//     onSuccess: (_data: Deliverable, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["deliverables", variables.projectId],
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["deliverable", variables.projectId, variables.deliverableId],
//       });
//       toast.success("Deliverable updated successfully!");
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to update deliverable: ${error.message}`);
//     },
//   });
// };

// export const useDeleteDeliverable = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       projectId,
//       deliverableId,
//     }: {
//       projectId: string;
//       deliverableId: string;
//     }) => deleteDeliverable(projectId, deliverableId),
//     onSuccess: (_data, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["deliverables", variables.projectId],
//       });
//       toast.success("Deliverable deleted successfully!");
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to delete deliverable: ${error.message}`);
//     },
//   });
// };
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createDeliverable,
  getDeliverables,
  getDeliverable,
  updateDeliverable,
  deleteDeliverable,
} from "../apis/deliverableService";
import type { Deliverable } from "../types/deliverable";

export const useCreateDeliverable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: Omit<
        Deliverable,
        "_id" | "id" | "project" | "createdAt" | "updatedAt"
      > & { createdBy: string };
    }) => {
      console.log("Calling createDeliverable with:", { projectId, data });
      return createDeliverable(projectId, data);
    },
    onSuccess: (_data: Deliverable, variables) => {
      console.log("Deliverable created successfully:", _data);
      queryClient.invalidateQueries({
        queryKey: ["deliverables", variables.projectId],
      });
      toast.success("Deliverable created successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to create deliverable:", {
        message: error.message,
        details: error.response?.data || error,
      });
      toast.error(error.message || "Failed to create deliverable");
    },
  });
};

export const useGetDeliverables = (
  projectId: string,
  options: { enabled: boolean }
) => {
  return useQuery({
    queryKey: ["deliverables", projectId],
    queryFn: () => getDeliverables(projectId),
    enabled: !!projectId && options.enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetDeliverable = (projectId: string, deliverableId: string) => {
  return useQuery({
    queryKey: ["deliverable", projectId, deliverableId],
    queryFn: () => getDeliverable(projectId, deliverableId),
    enabled: !!projectId && !!deliverableId,
  });
};

export const useUpdateDeliverable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      deliverableId,
      data,
    }: {
      projectId: string;
      deliverableId: string;
      data: Partial<Deliverable>;
    }) => updateDeliverable(projectId, deliverableId, data),
    onSuccess: (_data: Deliverable, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["deliverables", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["deliverable", variables.projectId, variables.deliverableId],
      });
      toast.success("Deliverable updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update deliverable");
    },
  });
};

export const useDeleteDeliverable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      deliverableId,
    }: {
      projectId: string;
      deliverableId: string;
    }) => deleteDeliverable(projectId, deliverableId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["deliverables", variables.projectId],
      });
      toast.success("Deliverable deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete deliverable");
    },
  });
};