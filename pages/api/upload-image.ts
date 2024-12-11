import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { BASE_IMAGE_URL } from "@/config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, imageName, imageData } = req.body;

  if (!id || !imageName || !imageData) {
    return res.status(400).json({ error: "Missing id, imageName, or imageData" });
  }

  // Используем BASE_IMAGE_URL как базовый путь
  const assetsDir = path.join(process.cwd(), "public", "_assets", id.toString());
  const imagePath = path.join(assetsDir, imageName);

  try {
    // Создание директории, если её нет
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Запись файла
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFileSync(imagePath, Buffer.from(base64Data, "base64"));

    res.status(200).json({ success: true, imagePath: `${BASE_IMAGE_URL}/${id}/${imageName}` });
  } catch (error) {
    console.error("Ошибка при сохранении изображения:", error);
    res.status(500).json({ error: "Ошибка при сохранении изображения" });
  }
}
