"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="flex align-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 jestify-center items-center mt-10 px-10 max-w-lg">
        <h3 className="text-xl font-bold">Форма для регистрации</h3>
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
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <Button type="submit">Зарегистрироваться</Button>
        <p>{message}</p>
      </form>
    </div>
  );
}
