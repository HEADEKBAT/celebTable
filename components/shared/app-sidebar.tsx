"use client";

import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react";
import { Home, LogIn, LucideProps, Shield, Table, UserCheck } from "lucide-react";
import Image from "next/image";
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
import { AppSidebarFooter } from "./app-sidebar-footer";
import { useAuthStore } from "@/lib/auth-store";

import logoImg from "../../image/logo.png";
// Все пункты меню
const allItems = [
  {
    title: "Home",
    page: "home",
    icon: Home,
  },
  {
    title: "Register",
    page: "register",
    icon: UserCheck,
  },
  {
    title: "Login",
    page: "login",
    icon: LogIn,
  },
  {
    title: "authTable",
    page: "authTable",
    icon: Shield,
  },
  {
    title: "Таблица",
    page: "table",
    icon: Table,
  },
];

interface AppSidebarProps {
  onNavigate: (page: string) => void; // Функция для передачи текущей страницы
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const { user, checkAuth } = useAuthStore();
  const [activePage, setActivePage] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<typeof allItems>([]);

  // При монтировании проверяем авторизацию
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Фильтрация доступных пунктов меню в зависимости от статуса пользователя
  useEffect(() => {
    let allowedItems:
      | typeof allItems
      | ((
          prevState: {
            title: string;
            page: string;
            icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
          }[]
        ) => {
          title: string;
          page: string;
          icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
        }[]) = [];
    if (!user) {
      // Не авторизован: доступны только Home, Login, Register
      allowedItems = allItems.filter((item) => ["home", "login", "register"].includes(item.page));
      if (!allowedItems.find((item) => item.page === activePage)) {
        setActivePage("home");
        onNavigate("home");
      }
    } else {
      // Пользователь авторизован
      if (user.role === "noUser" || user.role === "newUser") {
        allowedItems = allItems.filter((item) => item.page === "home");
        if (!allowedItems.find((item) => item.page === activePage)) {
          setActivePage("home");
          onNavigate("home");
        }
      } else if (user.role === "teamUser") {
        allowedItems = allItems.filter((item) => ["home", "table"].includes(item.page));
        if (!allowedItems.find((item) => item.page === activePage)) {
          setActivePage("home");
          onNavigate("home");
        }
      } else if (user.role === "admin") {
        // Для админа доступны все страницы, кроме регистрации и авторизации.
        allowedItems = allItems.filter((item) => !["register", "login"].includes(item.page));
        if (!activePage) {
          setActivePage("home");
          onNavigate("home");
        }
      }
    }
    setFilteredItems(allowedItems);
  }, [user, onNavigate, activePage]);

  const handleNavigation = (page: string) => {
    setActivePage(page);
    onNavigate(page);
  };

  return (
    <Sidebar className="bg-sky-400">
      <SidebarContent className="main-bg-color">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white text-xl mb-8 mt-4 flex gap-2 ">
            <Image
              src={logoImg}
              priority={true}
              alt=""
              width={50}
              height={50}
              className="block rounded-xl border-2 border-sky-400/30"
            />
            Ulysse
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="text-white">
              {filteredItems.map((item) => (
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
