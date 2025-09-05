import apiClient from "./apiClient";
import type { Task } from "../types/task";

export const createTask = async (
  projectId: string,
  data: Omit<Task, "_id" | "project" | "createdBy" | "createdAt" | "updatedAt">
): Promise<Task> => {
  try {
    const response = await apiClient.post(
      `/api/projects/${projectId}/tasks`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Create task error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to create task");
  }
};

export const getTasks = async (projectId: string): Promise<Task[]> => {
  try {
    const response = await apiClient.get(`/api/projects/${projectId}/tasks`);
    return response.data;
  } catch (error: any) {
    console.error("Get tasks error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to fetch tasks");
  }
};

export const getTask = async (
  projectId: string,
  taskId: string
): Promise<Task> => {
  try {
    const response = await apiClient.get(
      `/api/projects/${projectId}/tasks/${taskId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get task error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to fetch task");
  }
};

export const updateTask = async (
  projectId: string,
  taskId: string,
  data: Partial<Task>
): Promise<Task> => {
  try {
    const response = await apiClient.put(
      `/api/projects/${projectId}/tasks/${taskId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Update task error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to update task");
  }
};

export const deleteTask = async (
  projectId: string,
  taskId: string
): Promise<void> => {
  try {
    await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
  } catch (error: any) {
    console.error("Delete task error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to delete task");
  }
};
