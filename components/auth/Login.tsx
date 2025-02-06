"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert } from "../ui/alert";
import { useAuthStore } from "../../lib/auth-store";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      // Можно добавить редирект или уведомление об успешном входе
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ошибка авторизации");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 bg-white shadow-lg rounded-md max-w-sm w-full"
      >
        <h3 className="text-2xl font-bold text-center">Вход</h3>

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

        {error && <Alert variant="destructive">{error}</Alert>}
      </form>
    </div>
  );
}
