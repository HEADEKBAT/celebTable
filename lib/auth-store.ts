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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  
  // Метод авторизации: при успешном входе сохраняем данные в состояние и localStorage под ключом "UliseUser"
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

  // Метод выхода: очищаем состояние и удаляем объект из localStorage
  logout: () => {
    set({ user: null });
    localStorage.removeItem("UliseUser");
  },

  // Устанавливаем пользователя и сохраняем в localStorage
  setUser: (user: User) => {
    set({ user });
    localStorage.setItem("UliseUser", JSON.stringify(user));
  },

  // Метод для проверки наличия ранее авторизованного пользователя в localStorage.
  // Если объект найден, обновляем состояние.
  checkAuth: () => {
    const storedUser = localStorage.getItem("UliseUser");
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        set({ user });
      } catch (err) {
        console.error("Ошибка парсинга данных из localStorage:", err);
      }
    }
  },
}));