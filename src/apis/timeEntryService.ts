import apiClient from "./apiClient";
import type { TimeEntry } from "../types/timeEntry";

export const createTimeEntry = async (
  projectId: string,
  data: Omit<TimeEntry, "_id" | "user" | "project" | "createdAt" | "updatedAt">
): Promise<TimeEntry> => {
  try {
    const response = await apiClient.post(
      `/api/projects/${projectId}/time-entries`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Create time entry error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to create time entry"
    );
  }
};

export const getTimeEntries = async (
  projectId: string
): Promise<TimeEntry[]> => {
  try {
    const response = await apiClient.get(
      `/api/projects/${projectId}/time-entries`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get time entries error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to fetch time entries"
    );
  }
};

export const getTimeEntry = async (
  projectId: string,
  timeEntryId: string
): Promise<TimeEntry> => {
  try {
    const response = await apiClient.get(
      `/api/projects/${projectId}/time-entries/${timeEntryId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get time entry error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to fetch time entry"
    );
  }
};

export const updateTimeEntry = async (
  projectId: string,
  timeEntryId: string,
  data: Partial<TimeEntry>
): Promise<TimeEntry> => {
  try {
    const response = await apiClient.put(
      `/api/projects/${projectId}/time-entries/${timeEntryId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Update time entry error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to update time entry"
    );
  }
};

export const deleteTimeEntry = async (
  projectId: string,
  timeEntryId: string
): Promise<void> => {
  try {
    await apiClient.delete(
      `/api/projects/${projectId}/time-entries/${timeEntryId}`
    );
  } catch (error: any) {
    console.error("Delete time entry error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to delete time entry"
    );
  }
};
