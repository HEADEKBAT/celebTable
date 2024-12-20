"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert } from "../ui/alert";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Валидация длины пароля
    if (form.password.length < 4) {
      setError("Пароль должен содержать минимум 6 символов");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ошибка при регистрации");
      }

      setMessage("Регистрация прошла успешно!");
      setForm({ email: "", password: "", name: "" }); // Очистка формы
    } catch (err: unknown | Error) {
      setError(err.message || "Произошла ошибка при регистрации");
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
        {message && <Alert variant="destructive">{message}</Alert>}
      </form>
    </div>
  );
}
