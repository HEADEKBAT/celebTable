import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не поддерживается" });
  }

  try {
    // Создаем новую запись с пустыми полями
    const newCelebrity = await prisma.celebrities.create({
      data: {
        geo: "",
        name: "",
        category: "",
        subject: "",
        about: "",
        cimg1: "",
        cimg2: "",
        cimg3: "",
        cimg4: "",
        cimg5: "",
      },
    });

    res.status(201).json(newCelebrity);
  } catch (error) {
    console.error("Ошибка при создании новой записи:", error);
    res.status(500).json({ error: "Ошибка при создании новой записи" });
  }
}
