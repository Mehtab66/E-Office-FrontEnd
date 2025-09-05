import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  addProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../apis/projectService";
import type { Project } from "../types/project";

export const useAddProject = () => {
  return useMutation({
    mutationFn: addProject,
    onSuccess: (data: Project) => {
      toast.success("Project added successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add project: ${error.message}`);
    },
  });
};

export const useGetProjects = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["projects", page, limit],
    queryFn: () => getProjects(page, limit),
  });
};

export const useGetProject = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
    enabled: !!id,
  
  });
};

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      updateProject(id, data),
    onSuccess: (data: Project) => {
      toast.success("Project updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`);
    },
  });
};

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });
};
