import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: Omit<
        Deliverable,
        "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"
      >;
    }) => createDeliverable(projectId, data),
    onSuccess: (data: Deliverable) => {
      toast.success("Deliverable created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create deliverable: ${error.message}`);
    },
  });
};

export const useGetDeliverables = (projectId: string) => {
  return useQuery({
    queryKey: ["deliverables", projectId],
    queryFn: () => getDeliverables(projectId),
    enabled: !!projectId,
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
    onSuccess: (data: Deliverable) => {
      toast.success("Deliverable updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update deliverable: ${error.message}`);
    },
  });
};

export const useDeleteDeliverable = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      deliverableId,
    }: {
      projectId: string;
      deliverableId: string;
    }) => deleteDeliverable(projectId, deliverableId),
    onSuccess: () => {
      toast.success("Deliverable deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete deliverable: ${error.message}`);
    },
  });
};
