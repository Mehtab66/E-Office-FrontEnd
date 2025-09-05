import apiClient from "./apiClient";
import type { Client } from "../types/client";

export const addClient = async (
  data: Omit<
    Client,
    "_id" | "projects" | "createdBy" | "createdAt" | "updatedAt"
  >
): Promise<Client> => {
  try {
    const response = await apiClient.post("/api/clients", data);
    return response.data.client;
  } catch (error: any) {
    console.error("Add client error:", JSON.stringify(error, null, 2));
    console.error("Response data:", error.response?.data);
    console.error("Response message:", error.response?.data?.error);
    let message = "Something went wrong";
    if (error?.response?.data?.error) {
      message = error.response.data.error;
    } else if (error?.response) {
      message = `HTTP Error: ${error.response.status}`;
    } else if (error?.request) {
      message = "No response from server. Please try again.";
    } else if (error?.message) {
      message = error.message;
    }
    throw new Error(message);
  }
};

export const getClients = async (
  page: number = 1,
  limit: number = 20
): Promise<Client[]> => {
  try {
    const response = await apiClient.get(
      `/api/clients?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get clients error:", JSON.stringify(error, null, 2));
    console.error("Response data:", error.response?.data);
    console.error("Response message:", error.response?.data?.error);
    let message = "Something went wrong";
    if (error?.response?.data?.error) {
      message = error.response.data.error;
    } else if (error?.response) {
      message = `HTTP Error: ${error.response.status}`;
    } else if (error?.request) {
      message = "No response from server. Please try again.";
    } else if (error?.message) {
      message = error.message;
    }
    throw new Error(message);
  }
};

export const getClient = async (id: string): Promise<Client> => {
  try {
    const response = await apiClient.get(`/api/clients/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get client error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to fetch client");
  }
};

export const updateClient = async (
  id: string,
  data: Partial<Client>
): Promise<Client> => {
  try {
    const response = await apiClient.put(`/api/clients/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Update client error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to update client");
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/clients/${id}`);
  } catch (error: any) {
    console.error("Delete client error:", JSON.stringify(error, null, 2));
    throw new Error(error.response?.data?.error || "Failed to delete client");
  }
};
