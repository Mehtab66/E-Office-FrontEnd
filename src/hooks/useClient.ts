import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import createClient from "../apis/apiClient";
import getClients from "../apis/apiClient";
import type { Client } from "../types/client";

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: (newClient: Client) => {
      // Optimistically update the clients list
      queryClient.setQueryData(
        ["clients", newClient],
        (oldData: Client[] | undefined) => {
          if (!oldData) return [newClient];
          return [...oldData, newClient];
        }
      );
      // Invalidate related queries
      queryClient.invalidateQueries(["clients"]);
      // Invalidate projects to ensure client lists in project forms are updated
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

export const useClients = (userId?: string) => {
  return useQuery({
    queryKey: ["clients", userId],
    queryFn: () => getClients(userId),
    enabled: !!userId, // Only fetch if userId is provided
  });
};
