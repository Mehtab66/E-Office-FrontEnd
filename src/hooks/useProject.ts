import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjects } from "../apis/projectService";
import type { Project } from "../types/project";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (newProject: Project) => {
      // Optimistically update the projects list
      queryClient.setQueryData(
        ["projects", newProject.userId],
        (oldData: Project[] | undefined) => {
          if (!oldData) return [newProject];
          return [...oldData, newProject];
        }
      );
      // Invalidate related queries
      queryClient.invalidateQueries(["projects", newProject.userId]);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

export const useProjects = (userId?: string) => {
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: () => getProjects(userId),
    enabled: !!userId, // Only fetch if userId is provided
  });
};
