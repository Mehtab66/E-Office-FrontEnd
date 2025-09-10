import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createTimeEntry,
  getTimeEntries,
  getAllTimeEntries,
  getTimeEntry,
  updateTimeEntry,
  approveTimeEntry,
  deleteTimeEntry,
} from "../apis/timeEntryService";
import type { TimeEntry } from "../types/timeEntry";

export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      toast.success("Time entry created successfully!");
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
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

export const useGetAllTimeEntries = (params: {
  projectId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["allTimeEntries", params],
    queryFn: () => getAllTimeEntries(params),
    enabled: !!params,
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
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      toast.success("Time entry updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update time entry: ${error.message}`);
    },
  });
};

export const useApproveTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeEntryId,
      approved,
    }: {
      timeEntryId: string;
      approved: boolean;
    }) => approveTimeEntry(timeEntryId, approved),
    onSuccess: () => {
      toast.success("Time entry approval updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve time entry: ${error.message}`);
    },
  });
};

export const useDeleteTimeEntry = () => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete time entry: ${error.message}`);
    },
  });
};
