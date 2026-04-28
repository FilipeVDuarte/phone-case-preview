import "dotenv/config";
import * as http from "http";
import { createServer, createWebSocketServer } from "./server/index";

const app = createServer();
const httpServer = http.createServer(app);

createWebSocketServer(httpServer);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Express server running on http://localhost:${port}`);
});

process.on("SIGTERM", () => {
  httpServer.close(() => {
    console.log("Express server closed");
    process.exit(0);
  });
});
