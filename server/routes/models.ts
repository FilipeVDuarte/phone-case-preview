import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

export const handleGetModels: RequestHandler = (req, res) => {
  try {
    const jsonPath = path.join(process.cwd(), "models.json");
    const models: Array<{ name: string; mockupImageUrl: string; screenMaskPath: string }> =
      JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    const result = models.map(m => ({
      id: m.name.toLowerCase().replace(/\s+/g, "-"),
      name: m.name,
      mockupImageUrl: m.mockupImageUrl,
      screenMaskPath: m.screenMaskPath,
      frameWidth: 500,
      frameHeight: 1000,
      isAvailable: true,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error loading models:", error);
    res.status(500).json({ error: "Failed to load models" });
  }
};
