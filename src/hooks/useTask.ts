import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../apis/taskService";
import type { Task } from "../types/task";

export const useCreateTask = () => {
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
    onSuccess: (data: Task) => {
      toast.success("Task created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
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

export const useGetTask = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", projectId, taskId],
    queryFn: () => getTask(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
};

export const useUpdateTask = () => {
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
    onSuccess: (data: Task) => {
      toast.success("Task updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });
};

export const useDeleteTask = () => {
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
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });
};
