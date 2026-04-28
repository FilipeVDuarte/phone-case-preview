import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { WebSocketServer } from "ws";
import { handleDemo } from "./routes/demo";
import { handleGetModels } from "./routes/models";
// [QR_PAUSED] import { qrRouter, registerWebSocket } from "./routes/qr-upload";
// ─────────────────────────────────────────────────────────────────────────────
// FEATURE PAUSED — QR Upload / WebSocket Server (v1.8)
// Motivo: aguardando confirmação de Wi-Fi dedicado no quiosque físico.
// Para reativar: descomente as linhas marcadas [QR_PAUSED] neste arquivo
// e reative os blocos correspondentes em index.html (CSS + HTML + JS).
// ─────────────────────────────────────────────────────────────────────────────

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from root and public
  app.use(express.static(process.cwd()));
  app.use(express.static(path.join(process.cwd(), "public")));
  app.use("/assets", express.static(path.join(process.cwd(), "public/assets")));

  app.get("/api/ping", (_req, res) => {
    res.json({ message: "ping" });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/models", handleGetModels);

  // [QR_PAUSED] app.use("/api", qrRouter);

  // [QR_PAUSED] Mobile upload page — served for any /mobile/:sessionId path
  // [QR_PAUSED] app.get("/mobile/:sessionId", (_req, res) => {
  // [QR_PAUSED]   res.sendFile(path.join(process.cwd(), "public/mobile/index.html"));
  // [QR_PAUSED] });

  // Fallback to serve index.html for all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "index.html"));
  });

  return app;
}

// [QR_PAUSED] WebSocket upgrade handler — desativado enquanto QR Upload está pausado.
// Mantém a assinatura exportada para que dev-server.ts e node-build.ts compilem sem erro.
export function createWebSocketServer(httpServer: import("http").Server) {
  const wss = new WebSocketServer({ noServer: true });

  // [QR_PAUSED] httpServer.on("upgrade", (req, socket, head) => {
  // [QR_PAUSED]   if (req.url?.startsWith("/ws")) {
  // [QR_PAUSED]     wss.handleUpgrade(req, socket, head, (ws) => {
  // [QR_PAUSED]       const params = new URLSearchParams(req.url!.split("?")[1] ?? "");
  // [QR_PAUSED]       const sessionId = params.get("sessionId");
  // [QR_PAUSED]       if (sessionId) registerWebSocket(sessionId, ws);
  // [QR_PAUSED]       else ws.close();
  // [QR_PAUSED]     });
  // [QR_PAUSED]   }
  // [QR_PAUSED] });

  return wss;
}
