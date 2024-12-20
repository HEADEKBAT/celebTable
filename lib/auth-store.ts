import { create } from "zustand";

interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("Token not found in localStorage");
      return;
    }
  
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const user = await res.json();
      console.log("User loaded:", user); // Лог для проверки
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
