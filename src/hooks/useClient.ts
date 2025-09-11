import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  addClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
} from "../apis/clientService";
import type { Client } from "../types/client";

export const useAddClient = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      toast.success("Client added successfully!");
      queryClient.invalidateQueries({ queryKey: ["managerDashboardStats"] });
      queryClient.invalidateQueries({queryKey:["clients"]})
            console.log('Current queries:', queryClient.getQueryCache().getAll());
    },
    onError: (error: Error) => {
      toast.error(`Failed to add client: ${error.message}`);
    },
  });
};

export const useGetClients = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["clients", page, limit],
    queryFn: () => getClients(page, limit),
  });
};

export const useGetClient = (id: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
};

export const useUpdateClient = () => {
      const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      updateClient(id, data),
    onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["clients"]})

      toast.success("Client updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update client: ${error.message}`);
    },
  });
};

export const useDeleteClient = () => {
      const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast.success("Client deleted successfully!");
                  queryClient.invalidateQueries({queryKey:["clients"]})

    },
    onError: (error: Error) => {
      toast.error(`Failed to delete client: ${error.message}`);
    },
  });
};
