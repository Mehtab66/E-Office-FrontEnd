// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import {
//   createTask,
//   createSubtask,
//   getTasks,
//   getAllTasks,
//   getTask,
//   updateTask,
//   deleteTask,
// } from "../apis/taskService";
// import type { Task, Subtask } from "../types/task";

// export const useCreateTask = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       projectId,
//       data,
//     }: {
//       projectId: string;
//       data: Omit<
//         Task,
//         "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"
//       >;
//     }) => createTask(projectId, data),
//     onSuccess: () => {
//       toast.success("Task created successfully!");
//       queryClient.invalidateQueries({ queryKey: ["tasks"] });
//       queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to create task: ${error.message}`);
//     },
//   });
// };

// export const useCreateSubtask = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       projectId,
//       taskId,
//       data,
//     }: {
//       projectId: string;
//       taskId: string;
//       data: Omit<Subtask, "_id" | "createdAt" | "updatedAt">;
//     }) => createSubtask(projectId, taskId, data),
//     onSuccess: () => {
//       toast.success("Subtask created successfully!");
//       queryClient.invalidateQueries({ queryKey: ["tasks"] });
//       queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to create subtask: ${error.message}`);
//     },
//   });
// };

// export const useGetTasks = (projectId: string) => {
//   return useQuery({
//     queryKey: ["tasks", projectId],
//     queryFn: () => getTasks(projectId),
//     enabled: !!projectId,
//   });
// };

// export const useGetAllTasks = (params: {
//   projectId?: string;
//   priority?: string;
//   status?: string;
//   page?: number;
//   limit?: number;
// }) => {
//   return useQuery({
//     queryKey: ["allTasks", params],
//     queryFn: () => getAllTasks(params),
//     enabled: !!params,
//   });
// };

// export const useGetTask = (projectId: string, taskId: string) => {
//   return useQuery({
//     queryKey: ["task", projectId, taskId],
//     queryFn: () => getTask(projectId, taskId),
//     enabled: !!projectId && !!taskId,
//   });
// };

// export const useUpdateTask = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       projectId,
//       taskId,
//       data,
//     }: {
//       projectId: string;
//       taskId: string;
//       data: Partial<Task>;
//     }) => updateTask(projectId, taskId, data),
//     onSuccess: () => {
//       toast.success("Task updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["tasks"] });
//       queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to update task: ${error.message}`);
//     },
//   });
// };

// export const useDeleteTask = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       projectId,
//       taskId,
//     }: {
//       projectId: string;
//       taskId: string;
//     }) => deleteTask(projectId, taskId),
//     onSuccess: () => {
//       toast.success("Task deleted successfully!");
//       queryClient.invalidateQueries({ queryKey: ["tasks"] });
//       queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to delete task: ${error.message}`);
//     },
//   });
// };
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createTask,
  createSubtask,
  getTasks,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  updateSubtask,
  deleteSubtask,
} from "../apis/taskService";
import type { Task, Subtask } from "../types/task";

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: Omit<
        Task,
        "_id" | "project" | "createdBy" | "createdAt" | "updatedAt"
      >;
    }) => createTask(projectId, data),
    onSuccess: (_, variables) => {
      toast.success("Task created successfully!");
      // Invalidate specific project tasks
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      // Invalidate all tasks query
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      // Invalidate projects (might affect task counts)
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
      console.error("Create task mutation error:", error);
    },
  });
};

/**
 * Hook to create a subtask
 */
export const useCreateSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
      data,
    }: {
      projectId: string;
      taskId: string;
      data: Omit<Subtask, "_id" | "createdAt" | "updatedAt">;
    }) => createSubtask(projectId, taskId, data),
    onSuccess: (_, variables) => {
      toast.success("Subtask created successfully!");
      // Invalidate parent task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.projectId, variables.taskId],
      });
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      // Invalidate all tasks
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create subtask: ${error.message}`);
      console.error("Create subtask mutation error:", error);
    },
  });
};

/**
 * Hook to fetch tasks for a specific project
 * FIXED: Now properly handles undefined projectId
 */
export const useGetTasks = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => {
      if (!projectId) {
        return Promise.resolve([]);
      }
      return getTasks(projectId);
    },
    enabled: !!projectId, // Only fetch when projectId exists
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes (previously cacheTime)
    retry: 2, // Retry failed requests twice
  });
};

/**
 * Hook to fetch all tasks across projects with filters
 */
export const useGetAllTasks = (params: {
  projectId?: string;
  priority?: string;
  status?: string;
  page?: number;
  limit?: number;
} = {}) => {
  return useQuery({
    queryKey: ["allTasks", params],
    queryFn: () => getAllTasks(params),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to fetch a single task
 */
export const useGetTask = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", projectId, taskId],
    queryFn: () => getTask(projectId, taskId),
    enabled: !!projectId && !!taskId,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to update a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
      data,
    }: {
      projectId: string;
      taskId: string;
      data: Partial<Task>;
    }) => updateTask(projectId, taskId, data),
    onSuccess: (_, variables) => {
      toast.success("Task updated successfully!");
      // Invalidate specific task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.projectId, variables.taskId],
      });
      // Invalidate tasks list for project
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      // Invalidate all tasks
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      // Invalidate projects
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update task: ${error.message}`);
      console.error("Update task mutation error:", error);
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
    }: {
      projectId: string;
      taskId: string;
    }) => deleteTask(projectId, taskId),
    onSuccess: (_, variables) => {
      toast.success("Task deleted successfully!");
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      // Invalidate all tasks
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      // Invalidate projects
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task: ${error.message}`);
      console.error("Delete task mutation error:", error);
    },
  });
};

/**
 * Hook to update a subtask
 */
export const useUpdateSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
      subtaskId,
      data,
    }: {
      projectId: string;
      taskId: string;
      subtaskId: string;
      data: Partial<Subtask>;
    }) => updateSubtask(projectId, taskId, subtaskId, data),
    onSuccess: (_, variables) => {
      toast.success("Subtask updated successfully!");
      // Invalidate parent task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.projectId, variables.taskId],
      });
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      // Invalidate all tasks
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update subtask: ${error.message}`);
      console.error("Update subtask mutation error:", error);
    },
  });
};

/**
 * Hook to delete a subtask
 */
export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
      subtaskId,
    }: {
      projectId: string;
      taskId: string;
      subtaskId: string;
    }) => deleteSubtask(projectId, taskId, subtaskId),
    onSuccess: (_, variables) => {
      toast.success("Subtask deleted successfully!");
      // Invalidate parent task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.projectId, variables.taskId],
      });
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      // Invalidate all tasks
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete subtask: ${error.message}`);
      console.error("Delete subtask mutation error:", error);
    },
  });
};