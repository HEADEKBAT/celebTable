"use client";

import { useEffect, useState } from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { LogOut } from "lucide-react";

export function AppSidebarFooter() {
  const [isClient, setIsClient] = useState(false);
  const { user, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
    // При монтировании проверяем, авторизован ли пользователь
    checkAuth();
  }, [checkAuth]);

  if (!isClient) return null;

  return (
    <SidebarFooter className="bg-blue-800 text-white">
      <div className="text-center flex flex-col">
        {user ? (
          <>
            <Button onClick={logout} variant="destructive" className="mt-2 ml-auto">
              <LogOut className="w-4 h-4" />
              {/* Выйти */}
            </Button>
            <p className="text-left">{user.name}</p>
            <p className="text-left">{user.email}</p>
          </>
        ) : (
          <p>Пользователь</p>
        )}
      </div>
    </SidebarFooter>
  );
}
