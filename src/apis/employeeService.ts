import apiClient from "./apiClient";

export interface User {
  department: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  grade: number;
  designation: string;
  cnic: string;
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
export const getEmployees = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get("/admin/GetEmployees");
    return response.data.users;
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
