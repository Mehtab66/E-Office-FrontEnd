import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Admin {
  _id: string;
  email: string;
  name?: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  grade: number;
  designation: string;
  cnic: string;
}

export type User = Admin | Employee;

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
