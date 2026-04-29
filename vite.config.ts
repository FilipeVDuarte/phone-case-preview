import { defineConfig, Plugin } from "vite";
import { createServer } from "./server/index";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/phone-case-preview/' : '/',
  server: {
    host: "0.0.0.0",
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
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(createServer());
    },
  };
}
