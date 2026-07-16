import apiClient from "./client";

/**
 * Tableau de bord.
 *
 * Backend Spring Boot attendu :
 *   GET /api/dashboard
 *   -> 200 OK
 *      {
 *        "stats": {
 *          "total": number,
 *          "actifs": number,
 *          "revoques": number,
 *          "dernier": { "prenom": string, "nom": string, "dateEnrolement": string } | null
 *        },
 *        "services": { "wallet": boolean, "issuer": boolean, "verifier": boolean },
 *        "issuerReady": boolean
 *      }
 *
 * Équivalent de la route Flask `GET /` (index()) dans app.py : les champs
 * `services.*` reprennent les pings faits vers wallet-api / issuer-api /
 * verifier-api (walt.id), à faire côté Spring Boot désormais.
 */
export async function getDashboard() {
  const { data } = await apiClient.get("/dashboard");
  return data;
}
