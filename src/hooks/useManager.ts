import { useQuery } from "@tanstack/react-query";
import { getManagerDashboardStats } from "../apis/managerService";

export const useManagerDashboardStats = () => {
  return useQuery<{
    projects: number;
    clients: number;
    employees: number;
  }>({
    queryKey: ["managerDashboardStats"],
    queryFn: getManagerDashboardStats,
  });
};
