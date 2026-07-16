import axios from "axios";

/**
 * Client HTTP central de l'application.
 *
 * Toute la couche React ne parle QU'A ce client, jamais directement à
 * wallet-api / issuer-api / verifier-api (walt.id). C'est le futur backend
 * Spring Boot qui joue ce rôle de pont : il expose les endpoints REST
 * `/api/...` consommés ici, et lui seul dialogue avec walt.id.
 *
 * -> Pour brancher Spring Boot : changer VITE_API_BASE_URL dans .env
 *    (par défaut http://localhost:8080/api).
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    Accept: "application/json",
  },
});

export default apiClient;
