import * as http from "http";
import { createServer, createWebSocketServer } from "./server/index.js";

const app = createServer();
const httpServer = http.createServer(app);

createWebSocketServer(httpServer);

const port = process.env.PORT || 8080;
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Mobifans server listening on port ${port}`);
});

process.on("SIGTERM", () => {
  httpServer.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
