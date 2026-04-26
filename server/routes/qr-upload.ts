import { Router } from 'express';
import multer from 'multer';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import type { WebSocket } from 'ws';
import { getLanIp } from '../utils/lan-ip.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const SESSION_TTL = 5 * 60 * 1000; // 5 minutos

interface Session {
  ws: WebSocket | null;
  expiry: number;
}

const sessions = new Map<string, Session>();

// Limpeza automática de sessões expiradas
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (session.expiry < now) {
      session.ws?.close();
      sessions.delete(id);
    }
  }
}, 60_000);

export function registerWebSocket(sessionId: string, ws: WebSocket) {
  const session = sessions.get(sessionId);
  if (!session) return;
  session.ws = ws;
  ws.on('close', () => {
    if (sessions.get(sessionId)?.ws === ws) {
      sessions.get(sessionId) && (sessions.get(sessionId)!.ws = null);
    }
  });
}

// POST /api/session — quiosque cria uma sessão e recebe o QR SVG
router.post('/session', async (req, res) => {
  const sessionId = uuidv4();
  sessions.set(sessionId, { ws: null, expiry: Date.now() + SESSION_TTL });

  const port = (req.socket as any).localPort ?? 8080;
  const ip = getLanIp();
  const url = `http://${ip}:${port}/mobile/${sessionId}`;

  const qrSvg = await QRCode.toString(url, {
    type: 'svg',
    margin: 1,
    color: { dark: '#000000', light: '#FFFFFF' },
  });

  res.json({ sessionId, qrSvg, url });
});

// POST /api/upload/:sessionId — celular envia a foto
router.post('/upload/:sessionId', upload.single('photo'), (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);

  if (!session || session.expiry < Date.now()) {
    res.status(404).json({ error: 'Sessão inválida ou expirada' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: 'Nenhuma imagem recebida' });
    return;
  }

  const mimeType = req.file.mimetype || 'image/jpeg';
  const base64 = req.file.buffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64}`;

  if (session.ws?.readyState === 1 /* OPEN */) {
    session.ws.send(JSON.stringify({ type: 'image', data: dataUrl }));
  }

  // Sessão expirada após uso — uma foto por sessão
  sessions.delete(sessionId);

  res.json({ ok: true });
});

export { router as qrRouter };
