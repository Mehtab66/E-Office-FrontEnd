import apiClient from "./apiClient";
import type { Task, Subtask } from "../types/task";

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

export const createSubtask = async (
  projectId: string,
  taskId: string,
  data: Omit<Subtask, "_id" | "createdAt" | "updatedAt">
): Promise<Subtask> => {
  try {
    const response = await apiClient.post(
      `/api/projects/${projectId}/tasks/${taskId}/subtasks`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Create subtask error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to create subtask");
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

export const getAllTasks = async (
  params: {
    projectId?: string;
    priority?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{ tasks: Task[]; pagination: any }> => {
  try {
    const query = new URLSearchParams();
    if (params.projectId) query.append("projectId", params.projectId);
    if (params.priority) query.append("priority", params.priority);
    if (params.status) query.append("status", params.status);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    const response = await apiClient.get(
      `/api/projects/global/tasks?${query.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get all tasks error:", JSON.stringify(error, null, 2));
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
