import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Proxy vers les 3 services waltid-identity (docker-compose du backend) utilises
// par client.ts. Le prefixe /api/<service> est retire avant transfert car les
// conteneurs n'exposent pas ce prefixe.
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Doit rester synchronise avec "paths" dans tsconfig.json (@/* -> src/*).
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/wallet": {
        target: "http://localhost:7001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wallet/, ""),
      },
      "/api/issuer": {
        target: "http://localhost:7002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/issuer/, ""),
      },
      "/api/verifier": {
        target: "http://localhost:7003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/verifier/, ""),
      },
    },
  },
});
