import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy optionnel : évite de configurer CORS côté Spring Boot pendant le
    // développement. Décommenter et adapter le port si besoin, puis dans
    // src/api/client.js utiliser baseURL: "/api" à la place de VITE_API_BASE_URL.
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //   },
    // },
  },
})
