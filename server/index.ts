import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { WebSocketServer } from "ws";
import { handleDemo } from "./routes/demo";
import { handleGetModels } from "./routes/models";
import { qrRouter, registerWebSocket } from "./routes/qr-upload";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from root and public
  console.log("Setting up static middleware...");
  app.use(express.static(process.cwd()));
  console.log("Setting up /assets middleware...");
  app.use("/assets", express.static(path.join(process.cwd(), "public/assets")));

  console.log("Setting up /api/ping route...");
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "ping" });
  });

  console.log("Setting up /api/demo route...");
  app.get("/api/demo", handleDemo);
  console.log("Setting up /api/models route...");
  app.get("/api/models", handleGetModels);

  // QR upload routes
  console.log("Setting up QR router...");
  app.use("/api", qrRouter);

  // Mobile upload page — served for any /mobile/:sessionId path
  app.get("/mobile/:sessionId", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "public/mobile/index.html"));
  });

  // Fallback to serve index.html for all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "index.html"));
  });

  return app;
}

export function createWebSocketServer(httpServer: import("http").Server) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    // Only handle our /ws path — leave Vite HMR (/vite-hmr, etc.) untouched
    if (req.url?.startsWith("/ws")) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        const params = new URLSearchParams(req.url!.split("?")[1] ?? "");
        const sessionId = params.get("sessionId");
        if (sessionId) registerWebSocket(sessionId, ws);
        else ws.close();
      });
    }
  });

  return wss;
}
