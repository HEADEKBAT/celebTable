import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
  };

  return (
    <div className="flex align-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 jestify-center items-center mt-10 px-10 max-w-lg">
        <h3 className="text-xl font-bold">Форма для входа</h3>
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
        <Button type="submit">Войти</Button>
        <p>{message}</p>
      </form>
    </div>
  );
}
