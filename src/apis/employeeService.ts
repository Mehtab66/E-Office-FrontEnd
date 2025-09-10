import apiClient from "./apiClient";

export interface User {
  createdAt?: string | number | Date; // 👈 optional
  department: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  grade: number;
  designation: string;
  cnic: string;
  role: "employee" | "manager"; // 👈 Added role field
}
export interface DashboardStats {
  activeProjects: number;
  hoursLogged: number;
  assignedTasks: number;
  teamLeadProjects: number;
}
// ✅ Create user
export const createUser = async (data: Omit<User, "_id">): Promise<User> => {
  try {
    const response = await apiClient.post("/admin/AddEmployee", data);
    return response.data.user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};

// ✅ Fetch all employees
export const getEmployees = async ({
  page = 1,
  limit = 10,
  sort = "-createdAt",
  search = "",
}: {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
} = {}): Promise<{
  users: User[];
  total: number;
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const response = await apiClient.get("/admin/GetEmployees", {
      params: { page, limit, sort, search },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch employees"
    );
  }
};

// ✅ Update employee
export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<User>;
}): Promise<User> => {
  try {
    const response = await apiClient.patch(`/admin/UpdateEmployee/${id}`, data);
    return response.data.user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

// ✅ Delete employee
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete(`/admin/DeleteEmployee/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

// Fetch dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get("/admin/GetDashboardStats");
    return response.data; // Returns { totalUsers, designations, totalDepartments }
  } catch (error: any) {
    if (typeof error === "object" && error !== null && "response" in error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
    throw new Error("Failed to fetch dashboard stats");
  }
};
export const getEmployeeDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiClient.get("/employee/stats");
    return response.data;
  } catch (error: any) {
    console.error("Get dashboard stats error:", JSON.stringify(error, null, 2));
    throw new Error(
      error.response?.data?.error || "Failed to fetch dashboard stats"
    );
  }
};
