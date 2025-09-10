import apiClient from "./apiClient";
import type { Project } from "../types/project";

export const addProject = async (
  data: Omit<Project, "_id" | "createdBy" | "createdAt" | "updatedAt">
): Promise<Project> => {
  try {
    const response = await apiClient.post("/api/projects", data);
    return response.data.project;
  } catch (error: any) {
    console.error("Add project error:", JSON.stringify(error, null, 2));
    console.error("Response data:", error.response?.data);
    console.error("Response message:", error.response?.data?.error);
    let message = "Something went wrong";
    if (error?.response?.data?.error) {
      message = error.response.data.error;
    } else if (error?.response) {
      message = `HTTP Error: ${error.response.status}`;
    } else if (error?.request) {
      message = "No response from server. Please try again.";
    } else if (error?.message) {
      message = error.message;
    }
    throw new Error(message);
  }
};

export const getProjects = async (
  page: number = 1,
  limit: number = 20
): Promise<{ projects: Project[]; pagination: any }> => {
  try {
    const response = await apiClient.get(
      `/api/projects?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get projects error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to fetch projects");
  }
};

export const getProject = async (id: string): Promise<Project> => {
  try {
    const response = await apiClient.get(`/api/projects/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get project error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to fetch project");
  }
};

export const updateProject = async (
  id: string,
  data: Partial<Project>
): Promise<Project> => {
  try {
    const response = await apiClient.put(`/api/projects/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Update project error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to update project");
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/projects/${id}`);
  } catch (error: any) {
    console.error("Delete project error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to delete project");
  }
};
