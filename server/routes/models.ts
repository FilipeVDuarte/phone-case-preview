import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import { PhoneModel } from "@shared/api";

export const handleGetModels: RequestHandler = (req, res) => {
  try {
    const csvPath = path.join(process.cwd(), "server", "data", "models.csv");
    const csvData = fs.readFileSync(csvPath, "utf8");
    const lines = csvData.split("\n").filter(line => line.trim());

    const models: any[] = lines.map(line => {
      const [name, mockup, faca] = line.split(",");
      
      const mockupPath = path.join(process.cwd(), "public", "assets", "previews", mockup);
      const facaPath = path.join(process.cwd(), "public", "assets", "facas", faca);
      
      const hasMockup = fs.existsSync(mockupPath);
      const hasFaca = fs.existsSync(facaPath);

      return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        mockupImageUrl: `/assets/previews/${mockup}`,
        screenMaskPath: `/assets/facas/${faca}`,
        // Standardized dimensions 500x1000
        screenOffsetX: 50,
        screenOffsetY: 50,
        screenWidth: 400,
        screenHeight: 900,
        frameWidth: 500,
        frameHeight: 1000,
        isAvailable: hasMockup && hasFaca
      };
    });

    res.json(models);
  } catch (error) {
    console.error("Error loading models:", error);
    res.status(500).json({ error: "Failed to load models" });
  }
};
