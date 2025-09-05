import apiClient from "../apis/apiClient"; // Adjust path to your apiClient

export const getManagerDashboardStats = async () => {
  try {
    const response = await apiClient.get("/manager/GetManagerDashboardStats");
    return response.data; // Returns { projects: number, clients: number, employees: number }
  } catch (error: any) {
    if (typeof error === "object" && error !== null && "response" in error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch manager dashboard stats"
      );
    }
    throw new Error("Failed to fetch manager dashboard stats");
  }
};
