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
} from "../apis/taskService";
import type { Task, Subtask } from "../types/task";

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
    onSuccess: () => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });
};

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
    onSuccess: () => {
      toast.success("Subtask created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create subtask: ${error.message}`);
    },
  });
};

export const useGetTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId),
    enabled: !!projectId,
  });
};

export const useGetAllTasks = (params: {
  projectId?: string;
  priority?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["allTasks", params],
    queryFn: () => getAllTasks(params),
    enabled: !!params,
  });
};

export const useGetTask = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", projectId, taskId],
    queryFn: () => getTask(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
};

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
    onSuccess: () => {
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });
};

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
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });
};
