import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, imageName } = req.body;
  if (!id || !imageName) {
    return res.status(400).json({ error: "Missing id or imageName" });
  }

  const imagePath = path.join(process.cwd(), "public", "images", id.toString(), imageName);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    return res.status(200).json({ success: true });
  } else {
    return res.status(404).json({ error: "File not found" });
  }
}
