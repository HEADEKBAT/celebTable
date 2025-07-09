"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import CelebritiesTable from "./CelebritiesTable";
import Register from "../auth/Register";
import AuthTable from "./auth-table";
import Login from "../auth/Login";
import { useAuthStore } from "@/lib/auth-store";

export default function Layout() {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<string>("");

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth) {
      if (user) {
        setCurrentPage("table");
      } else {
        setCurrentPage("login");
      }
    }
  }, [user, isCheckingAuth]);

  const pages: Record<string, React.ReactNode> = {
    home: <div>Добро пожаловать на главную страницу!</div>,
    table: <CelebritiesTable />,
    register: <Register onNavigate={setCurrentPage} />,
    authTable: <AuthTable />,
    login: <Login />,
  };

  // Пока auth не проверен — ничего не рендерим
  if (isCheckingAuth || !currentPage) return null;

  return (
    <SidebarProvider>
      <AppSidebar onNavigate={setCurrentPage} />
      <main className="w-full p-4">
        <SidebarTrigger />
        {pages[currentPage] || (
          <div>
            <h1>Страница не найдена!</h1>
            <button onClick={() => setCurrentPage("table")} className="btn btn-primary">
              Вернуться на главную
            </button>
          </div>
        )}
      </main>
    </SidebarProvider>
  );
}
