import { useMutation } from "@tanstack/react-query";
import { login, type User } from "../apis/authService";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

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
