"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert } from "../ui/alert";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_DATABASE_URL;

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("name", form.name);

      const res = await fetch(`${AUTH_URL}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка при регистрации");
      }

      // ✅ После успешной регистрации — переход на login
      onNavigate("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
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
        <h3 className="text-2xl font-bold text-center">Регистрация</h3>

        <Input
          type="text"
          placeholder="Имя"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <Input
          type="password"
          placeholder="Пароль (мин. 6 символов)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Зарегистрироваться"}
        </Button>

        {error && <Alert variant="destructive">{error}</Alert>}
      </form>
    </div>
  );
}
