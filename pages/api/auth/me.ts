import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { prismaAuth } from "@/lib/prisma"; // Подключаем prismaAuth

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    // Декодирование токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    // Получение данных пользователя из базы данных auth
    const user = await prismaAuth.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true }, // Выбираем нужные поля
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
