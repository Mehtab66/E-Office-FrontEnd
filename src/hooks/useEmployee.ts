import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployees,
  createUser,
  updateUser,
  getDashboardStats,
  deleteUser,
  type User,
} from "../apis/employeeService";
import { toast } from "react-toastify";

// ✅ Fetch employees
export const useEmployees = ({
  page = 1,
  limit = 10,
  sort = "-createdAt",
  search = "",
}: {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
} = {}) => {
  return useQuery<{
    users: User[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>({
    queryKey: ["employees", { page, limit, sort, search }],
    queryFn: () => getEmployees({ page, limit, sort, search }),
  });
};

// ✅ Create employee
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add user: ${error.message}`);
    },
  });
};

// ✅ Update employee
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
};

// ✅ Delete employee
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });
};
export type { User };
