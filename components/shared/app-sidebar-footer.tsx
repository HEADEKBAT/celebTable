"use client";

import { useEffect, useState } from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

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
    <SidebarFooter className="bg-blue-800 text-white p-4">
      <div className="text-center">
        {user ? (
          <>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <Button onClick={logout} variant="destructive" className="mt-2">
              Выйти
            </Button>
          </>
        ) : (
          <p>Пользователь</p>
        )}
      </div>
    </SidebarFooter>
  );
}
