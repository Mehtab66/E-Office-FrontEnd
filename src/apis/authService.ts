import apiClient from "./apiClient";

export interface Admin {
  _id: string;
  email: string;
  name?: string;
  designation: string; // Added to match backend response
  role: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  grade: number;
  designation: string;
  cnic: string;
  role: string;
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
    // Optional: If you have a backend logout endpoint, uncomment this
    // await apiClient.post("/auth/logout");
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
