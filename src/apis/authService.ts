import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import apiClient from "./apiClient";

export interface Admin {
  id?: string; // Matches API response
  _id: string;
  email: string;
  name?: string;
  designation: string;
  role: string; // Allow any string to match API
}

export interface Employee {
  id?: string; // Matches API response
  _id: string;
  name: string;
  email: string;
  phone: string;
  grade: number;
  designation: string;
  cnic: string;
  role: string; // Allow any string to match API
  projects: string[];
}

export type User = Admin | Employee;

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", JSON.stringify(error, null, 2));
    console.error("Response data:", error.response?.data);
    console.error("Response message:", error.response?.data?.message);
    let message = "Something went wrong";

    if (error?.response?.data?.message) {
      message = error.response.data.message;
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

export const logout = async (): Promise<void> => {
  try {
    localStorage.removeItem("authToken");
  } catch (error: any) {
    console.error("Logout error:", JSON.stringify(error, null, 2));
    let message = "Something went wrong during logout";
    if (error?.response?.data?.message) {
      message = error.response.data.message;
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

export const getCurrentUser = async (): Promise<Employee> => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error: any) {
    console.error("Get current user error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.message || "Failed to fetch user details"
    );
  }
};

export const useCurrentUser = () => {
  const { token } = useAuthStore();
  return useQuery<Employee, Error>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token,
  });
};
