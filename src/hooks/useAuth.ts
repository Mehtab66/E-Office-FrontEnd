import { useMutation } from "@tanstack/react-query";
import { login, logout, type User } from "../apis/authService";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
export const useAuthLogin = () => {
  const { login: setAuth } = useAuthStore();
  return useMutation({
    mutationFn: login,
    onSuccess: (data: { user: User; token: string }) => {
      localStorage.setItem("authToken", data.token); // Match apiClient key
      setAuth(data.user, data.token);
      toast.success("Login successful!");
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });
};
export const useAuthLogout = () => {
  const { logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      localStorage.removeItem("authToken");
      toast.success("Logged out successfully!");
      navigate("/login");
    },
    onError: (error: Error) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });
};
