import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: addClient,
    onSuccess: (data: Client) => {
      toast.success("Client added successfully!");
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
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      updateClient(id, data),
    onSuccess: (data: Client) => {
      toast.success("Client updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update client: ${error.message}`);
    },
  });
};

export const useDeleteClient = () => {
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast.success("Client deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete client: ${error.message}`);
    },
  });
};
