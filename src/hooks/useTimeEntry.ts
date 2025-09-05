import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createTimeEntry,
  getTimeEntries,
  getTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
} from "../apis/timeEntryService";
import type { TimeEntry } from "../types/timeEntry";

export const useCreateTimeEntry = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: Omit<
        TimeEntry,
        "_id" | "user" | "project" | "createdAt" | "updatedAt"
      >;
    }) => createTimeEntry(projectId, data),
    onSuccess: (data: TimeEntry) => {
      toast.success("Time entry created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create time entry: ${error.message}`);
    },
  });
};

export const useGetTimeEntries = (projectId: string) => {
  return useQuery({
    queryKey: ["timeEntries", projectId],
    queryFn: () => getTimeEntries(projectId),
    enabled: !!projectId,
   
  });
};

export const useGetTimeEntry = (projectId: string, timeEntryId: string) => {
  return useQuery({
    queryKey: ["timeEntry", projectId, timeEntryId],
    queryFn: () => getTimeEntry(projectId, timeEntryId),
    enabled: !!projectId && !!timeEntryId,
    
  });
};

export const useUpdateTimeEntry = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      timeEntryId,
      data,
    }: {
      projectId: string;
      timeEntryId: string;
      data: Partial<TimeEntry>;
    }) => updateTimeEntry(projectId, timeEntryId, data),
    onSuccess: (data: TimeEntry) => {
      toast.success("Time entry updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update time entry: ${error.message}`);
    },
  });
};

export const useDeleteTimeEntry = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      timeEntryId,
    }: {
      projectId: string;
      timeEntryId: string;
    }) => deleteTimeEntry(projectId, timeEntryId),
    onSuccess: () => {
      toast.success("Time entry deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete time entry: ${error.message}`);
    },
  });
};
