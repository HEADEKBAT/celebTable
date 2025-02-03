import { NextApiRequest, NextApiResponse } from "next";
import { prismaAuth } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не поддерживается" });
  }

  const { email, password } = req.body;

  try {
    // Поиск пользователя в базе данных
    const user = await prismaAuth.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    // Генерация токена
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Успешный вход", token });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
}
