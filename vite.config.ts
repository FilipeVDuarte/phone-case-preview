import { defineConfig, Plugin } from "vite";
import { createServer, createWebSocketServer } from "./server/index";

export default defineConfig({
  server: {
    host: "0.0.0.0", // expõe na LAN para o celular acessar
    port: 8080,
    fs: {
      allow: [".", "index.html", "public", "server/data"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [expressPlugin()],
});

function expressPlugin(): Plugin {
  let wsServerCreated = false;
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);

      // Inicializa WS assim que o httpServer estiver disponível
      server.httpServer?.once("listening", () => {
        if (!wsServerCreated && server.httpServer) {
          createWebSocketServer(server.httpServer);
          wsServerCreated = true;
        }
      });
    },
  };
}
