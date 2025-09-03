import apiClient from "./apiClient";
import type { Client } from "../types/client";

export const createClient = async (clientData: Partial<Client>) => {
  try {
    const response = await apiClient.post("/clients", clientData);
    return response.data?.data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export const getClients = async (userId?: string) => {
  try {
    const response = await apiClient.get(
      `/clients${userId ? `?userId=${userId}` : ""}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};
