import { defineConfig, Plugin } from "vite";
import { createServer } from "./server";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [".", "index.html", "public"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [expressPlugin()],
});

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
