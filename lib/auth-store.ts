import { create } from "zustand";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_DATABASE_URL;

export interface User {
  isAuthenticated: boolean;
  role: "admin" | "newUser" | "teamUser" | "noUser";
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isCheckingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isCheckingAuth: true,

  login: async (email: string, password: string) => {
    try {
      const res = await fetch(`${AUTH_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка авторизации");
      }

      const user: User = {
        isAuthenticated: true,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
      };

      set({ user });
      localStorage.setItem("UliseUser", JSON.stringify(user));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("UliseUser");
  },

  setUser: (user: User) => {
    set({ user });
    localStorage.setItem("UliseUser", JSON.stringify(user));
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const storedUser = localStorage.getItem("UliseUser");
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        set({ user });
      } else {
        set({ user: null });
      }
    } catch (err) {
      console.error("Ошибка парсинга данных из localStorage:", err);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));