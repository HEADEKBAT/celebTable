"use client";
import { useEffect, useState } from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/auth-store";

export function AppSidebarFooter() {
  const [isClient, setIsClient] = useState(false);
  const { user, checkAuth } = useAuthStore(); // Добавляем checkAuth

  useEffect(() => {
    setIsClient(true);
    checkAuth(); // Проверяем авторизацию при монтировании
  }, [checkAuth]);

  if (!isClient) return null; // Предотвращаем несоответствие SSR и CSR

  return (
    <SidebarFooter className="bg-blue-800 text-white">
      <div className="text-center">
        {user ? (
          <>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </>
        ) : (
          <p>Пользователь</p>
        )}
      </div>
    </SidebarFooter>
  );
}
