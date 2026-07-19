import axios from "axios";

// Trois clients distincts, un par service waltid-identity (equiv. wallet_base_url,
// issuer_base_url, verifier_base_url dans config.json).
// Par defaut on passe par le proxy Vite (voir vite.config.ts), qui redirige vers
// les conteneurs docker-compose du backend (wallet:7001, issuer:7002, verifier:7003).
// Cela evite tout probleme de CORS en developpement. On peut surcharger avec des
// URLs absolues via .env si les services sont appeles directement (CORS requis
// dans ce cas cote service).
export const walletClient = axios.create({
  baseURL: import.meta.env.VITE_WALLET_BASE_URL || "/api/wallet",
  withCredentials: true,
});

export const issuerClient = axios.create({
  baseURL: import.meta.env.VITE_ISSUER_BASE_URL || "/api/issuer",
});

export const verifierClient = axios.create({
  baseURL: import.meta.env.VITE_VERIFIER_BASE_URL || "/api/verifier",
});
