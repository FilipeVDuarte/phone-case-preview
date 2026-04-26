import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0", // expõe na LAN para o celular acessar
    port: 8080,
    fs: {
      allow: [".", "index.html", "public", "server/data"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
    hmr: {
      host: "localhost",
      port: 8080,
    },
  },
  build: {
    outDir: "dist/spa",
  },
});
