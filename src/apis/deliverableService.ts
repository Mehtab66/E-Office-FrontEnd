import apiClient from "./apiClient";
import type { Deliverable } from "../types/deliverable";

export const createDeliverable = async (
  projectId: string,
  data: Omit<
    Deliverable,
    "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"
  >
): Promise<Deliverable> => {
  try {
    console.log("Creating deliverable with data:", data);

    const response = await apiClient.post(
      `/api/projects/${projectId}/deliverables`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Create deliverable error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to create deliverable"
    );
  }
};

export const getDeliverables = async (
  projectId: string
): Promise<Deliverable[]> => {
  try {
    const response = await apiClient.get(
      `/api/projects/${projectId}/deliverables`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get deliverables error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to fetch deliverables"
    );
  }
};

export const getDeliverable = async (
  projectId: string,
  deliverableId: string
): Promise<Deliverable> => {
  try {
    const response = await apiClient.get(
      `/api/projects/${projectId}/deliverables/${deliverableId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get deliverable error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to fetch deliverable"
    );
  }
};

export const updateDeliverable = async (
  projectId: string,
  deliverableId: string,
  data: Partial<Deliverable>
): Promise<Deliverable> => {
  try {
    const response = await apiClient.put(
      `/api/projects/${projectId}/deliverables/${deliverableId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Update deliverable error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to update deliverable"
    );
  }
};

export const deleteDeliverable = async (
  projectId: string,
  deliverableId: string
): Promise<void> => {
  try {
    await apiClient.delete(
      `/api/projects/${projectId}/deliverables/${deliverableId}`
    );
  } catch (error: any) {
    console.error("Delete deliverable error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to delete deliverable"
    );
  }
};
