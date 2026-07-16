import apiClient from "./client";

/**
 * Registre national.
 *
 * Backend Spring Boot attendu :
 *   GET /api/registre?q={recherche}
 *   -> 200 OK
 *      [
 *        {
 *          "niu": string, "nin": string, "nom": string, "prenom": string,
 *          "credentialId": string, "dateEnrolement": string,
 *          "agentId": string, "statut": "ACTIF" | "REVOQUE"
 *        },
 *        ...
 *      ]
 *      (liste triée du plus récent au plus ancien, filtrée sur nom/prenom/niu/nin si "q" fourni)
 *
 * Équivalent de `registre_view()` dans app.py.
 */
export async function getRegistre(q = "") {
  const { data } = await apiClient.get("/registre", { params: q ? { q } : {} });
  return data;
}
