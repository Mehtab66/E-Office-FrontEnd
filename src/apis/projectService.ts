import apiClient from "./apiClient";
import type { Project } from "../types/project";

export const createProject = async (projectData: Partial<Project>) => {
  try {
    const response = await apiClient.post("/projects", projectData);
    return response.data?.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjects = async (userId?: string) => {
  try {
    const response = await apiClient.get(
      `/projects${userId ? `?userId=${userId}` : ""}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};
