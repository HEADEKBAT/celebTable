"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuthStore } from "@/lib/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Login() {
  const { setAuth } = useAuthStore(); // Получаем функцию для установки авторизации
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  console.log(API_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Сброс предыдущего сообщения

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ошибка при входе");
      }

      // Убедитесь, что вызывается setAuth с корректными данными
      setAuth(data.user, data.token);
      setMessage("Успешный вход!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || "Произошла ошибка");
      } else {
        setMessage("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-10 py-6 bg-gray-100 shadow-md rounded-lg">
        <h3 className="text-xl font-bold text-center">Вход в аккаунт</h3>

        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <Input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </Button>

        <p className={`text-sm text-center ${message.includes("Ошибка") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      </form>
    </div>
  );
}
