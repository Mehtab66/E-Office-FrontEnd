// import apiClient from "./apiClient";
// import type { Task, Subtask } from "../types/task";

// export const createTask = async (
//   projectId: string,
//   data: Omit<Task, "_id" | "project" | "createdBy" | "createdAt" | "updatedAt">
// ): Promise<Task> => {
//   try {
//     const response = await apiClient.post(
//       `/api/projects/${projectId}/tasks`,
//       data
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Create task error:", JSON.stringify(error, null, 2));
//     throw new Error(error.response?.data?.error || "Failed to create task");
//   }
// };

// export const createSubtask = async (
//   projectId: string,
//   taskId: string,
//   data: Omit<Subtask, "_id" | "createdAt" | "updatedAt">
// ): Promise<Subtask> => {
//   try {
//     const response = await apiClient.post(
//       `/api/projects/${projectId}/tasks/${taskId}/subtasks`,
//       data
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Create subtask error:", JSON.stringify(error, null, 2));
//     throw new Error(error.response?.data?.error || "Failed to create subtask");
//   }
// };

// export const getTasks = async (projectId: string): Promise<Task[]> => {
//   try {
//     const response = await apiClient.get(`/api/projects/${projectId}/tasks`);
//     return response.data;
//   } catch (error: any) {
//     console.error("Get tasks error:", JSON.stringify(error, null, 2));
//     throw new Error(error.response?.data?.error || "Failed to fetch tasks");
//   }
// };

// export const getAllTasks = async (
//   params: {
//     projectId?: string;
//     priority?: string;
//     status?: string;
//     page?: number;
//     limit?: number;
//   } = {}
// ): Promise<{ tasks: Task[]; pagination: any }> => {
//   try {
//     const query = new URLSearchParams();
//     if (params.projectId) query.append("projectId", params.projectId);
//     if (params.priority) query.append("priority", params.priority);
//     if (params.status) query.append("status", params.status);
//     if (params.page) query.append("page", params.page.toString());
//     if (params.limit) query.append("limit", params.limit.toString());

//     const response = await apiClient.get(
//       `/api/projects/global/tasks?${query.toString()}`
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Get all tasks error:", JSON.stringify(error, null, 2));
//     throw new Error(error.response?.data?.error || "Failed to fetch tasks");
//   }
// };

// export const getTask = async (
//   projectId: string,
//   taskId: string
// ): Promise<Task> => {
//   try {
//     const response = await apiClient.get(
//       `/api/projects/${projectId}/tasks/${taskId}`
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Get task error:", JSON.stringify(error, null, 2));
//     throw new Error(error.response?.data?.error || "Failed to fetch task");
//   }
// };

// export const updateTask = async (
//   projectId: string,
//   taskId: string,
//   data: Partial<Task>
// ): Promise<Task> => {
//   try {
//     const response = await apiClient.put(
//       `/api/projects/${projectId}/tasks/${taskId}`,
//       data
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Update task error:", JSON.stringify(error, null, 2));
//     throw new Error(error.response?.data?.error || "Failed to update task");
//   }
// };

// export const deleteTask = async (
//   projectId: string,
//   taskId: string
// ): Promise<void> => {
//   try {
//     await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
//   } catch (error: any) {
//     console.error("Delete task error:", JSON.stringify(error, null, 2));
//     throw new Error(error.response?.data?.error || "Failed to delete task");
//   }
// };
import apiClient from "./apiClient";
import type { Task, Subtask } from "../types/task";

/**
 * Create a new task for a project
 */
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
    console.error("Create task error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.error || "Failed to create task");
  }
};

/**
 * Create a subtask for a parent task
 * Note: Backend uses embedded subtasks within the task document
 */
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
    console.error("Create subtask error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.error || "Failed to create subtask");
  }
};

/**
 * Get all tasks for a specific project
 */
export const getTasks = async (projectId: string): Promise<Task[]> => {
  try {
    const response = await apiClient.get(`/api/projects/${projectId}/tasks`);
    return response.data;
  } catch (error: any) {
    console.error("Get tasks error:", {
      projectId,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.error || "Failed to fetch tasks");
  }
};

/**
 * Get all tasks across projects (with filters)
 * This uses the global tasks endpoint
 */
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
    console.error("Get all tasks error:", {
      params,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.error || "Failed to fetch tasks");
  }
};

/**
 * Get a single task by ID
 */
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
    console.error("Get task error:", {
      projectId,
      taskId,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.error || "Failed to fetch task");
  }
};

/**
 * Update an existing task
 */
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
    console.error("Update task error:", {
      projectId,
      taskId,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.error || "Failed to update task");
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (
  projectId: string,
  taskId: string
): Promise<void> => {
  try {
    await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
  } catch (error: any) {
    console.error("Delete task error:", {
      projectId,
      taskId,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.error || "Failed to delete task");
  }
};

/**
 * Update a subtask within a task
 * Note: You'll need to add this endpoint to your backend if not present
 */
export const updateSubtask = async (
  projectId: string,
  taskId: string,
  subtaskId: string,
  data: Partial<Subtask>
): Promise<Task> => {
  try {
    const response = await apiClient.put(
      `/api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Update subtask error:", {
      projectId,
      taskId,
      subtaskId,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.error || "Failed to update subtask");
  }
};

/**
 * Delete a subtask from a task
 * Note: You'll need to add this endpoint to your backend if not present
 */
export const deleteSubtask = async (
  projectId: string,
  taskId: string,
  subtaskId: string
): Promise<Task> => {
  try {
    const response = await apiClient.delete(
      `/api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Delete subtask error:", {
      projectId,
      taskId,
      subtaskId,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.error || "Failed to delete subtask");
  }
};