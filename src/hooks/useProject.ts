import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProject,
    onSuccess: (data: Project) => {
      toast.success("Project added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["managerDashboardStats"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      updateProject(id, data),
    onSuccess: (data: Project) => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["managerDashboardStats"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["managerDashboardStats"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });
};
