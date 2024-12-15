"use client";

import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import CelebritiesTable from "./CelebritiesTable";
import Register from "../auth/Register";
import Login from "../auth/Login";

export default function Layout() {
  const [currentPage, setCurrentPage] = useState<string>("home");

  // Объект страниц
  const pages: Record<string, React.ReactNode> = {
    home: <div>Добро пожаловать на главную страницу!</div>,
    table: <CelebritiesTable />,
    register: <Register />,
    login: <Login />,
  };

  return (
    <SidebarProvider>
      <AppSidebar onNavigate={setCurrentPage} />
      <main className="w-full p-4">
        <SidebarTrigger />
        {pages[currentPage] || (
          <div>
            <h1>Страница не найдена!</h1>
            <button onClick={() => setCurrentPage("home")} className="btn btn-primary">
              Вернуться на главную
            </button>
          </div>
        )}
      </main>
    </SidebarProvider>
  );
}
