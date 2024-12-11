import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = 1, limit = 10, sortBy = "id", sortOrder = "asc", filter = "" } = req.query;

    if (req.method === "GET") {
      // --- Получение данных с пагинацией, сортировкой и фильтрацией ---
      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);

      const skip = (pageNumber - 1) * pageSize; // Для пагинации
      const take = pageSize;

      const where = filter
        ? {
            OR: [
              { name: { contains: filter as string, mode: "insensitive" } },
              { category: { contains: filter as string, mode: "insensitive" } },
            ],
          }
        : undefined;

      const orderBy = {
        [sortBy as string]: sortOrder === "asc" ? "asc" : "desc",
      };

      const [data, total] = await Promise.all([
        prisma.celebrities.findMany({ where, orderBy, skip, take }),
        prisma.celebrities.count({ where }),
      ]);

      res.status(200).json({ data, total });
    } else if (req.method === "POST") {
      // --- Добавление новой записи ---
      const { geo, name, category, subject, about, cimg1, cimg2, cimg3, cimg4, cimg5 } = req.body;

      const newCelebrity = await prisma.celebrities.create({
        data: {
          geo,
          name,
          category,
          subject,
          about,
          cimg1: cimg1 || null,
          cimg2: cimg2 || null,
          cimg3: cimg3 || null,
          cimg4: cimg4 || null,
          cimg5: cimg5 || null,
        },
      });

      res.status(201).json(newCelebrity);
    } else if (req.method === "PUT") {
      // --- Обновление существующей записи ---
      const { id, geo, name, category, subject, about, cimg1, cimg2, cimg3, cimg4, cimg5 } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID записи обязателен для обновления" });
      }

      const updatedCelebrity = await prisma.celebrities.update({
        where: { id },
        data: {
          geo,
          name,
          category,
          subject,
          about,
          cimg1: cimg1 || null,
          cimg2: cimg2 || null,
          cimg3: cimg3 || null,
          cimg4: cimg4 || null,
          cimg5: cimg5 || null,
        },
      });

      res.status(200).json(updatedCelebrity);
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Метод ${req.method} не поддерживается`);
    }
  } catch (error) {
    console.error("Ошибка API:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
