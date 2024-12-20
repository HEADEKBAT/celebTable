"use client";
import { Home, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { AppSidebarFooter } from "./app-sidebar-footer";

interface AppSidebarProps {
  onNavigate: (page: string) => void; // Функция для передачи текущей страницы
}

// Menu items.
const items = [
  {
    title: "Home",
    page: "home",
    icon: Home,
  },
  {
    title: "Register",
    page: "register",
    icon: Settings,
  },
  {
    title: "Login",
    page: "login",
    icon: Settings,
  },
  {
    title: "Таблица",
    page: "table",
    icon: Search,
  },
];

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const [activePage, setActivePage] = useState<string>("home");


  const handleNavigation = (page: string) => {
    setActivePage(page); // Устанавливаем активную страницу
    onNavigate(page); // Вызываем родительскую функцию навигации
  };


  return (
    <Sidebar className="bg-sky-400">
      <SidebarContent className="bg-blue-800">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Ulise</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="text-white">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.page)}
                    className={`flex items-center gap-2 ${activePage === item.page ? "bg-blue-600" : ""}`}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AppSidebarFooter />
    </Sidebar>
  );
}
