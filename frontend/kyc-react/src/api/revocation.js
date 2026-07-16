import apiClient from "./client";

/**
 * Révocation d'identité.
 *
 * Backend Spring Boot attendu :
 *
 *   GET /api/citoyens/recherche?q={niuOuNin}
 *   -> 200 OK { "niu": string, "nin": string, "nom": string, "prenom": string,
 *               "statut": "ACTIF" | "REVOQUE", "dateRevocation": string | null }
 *   -> 404 Not Found si aucun citoyen ne correspond
 *
 * Équivalent de la recherche faite dans `revocation()` (GET) dans app.py.
 */
export async function rechercherCitoyen(q) {
  const { data } = await apiClient.get("/citoyens/recherche", { params: { q } });
  return data;
}

/**
 *   POST /api/revocations
 *   Body : { "niu": string, "motif": string }
 *   -> 200 OK { "niu": string, "statut": "REVOQUE", "dateRevocation": string }
 *   -> 404 Not Found si le citoyen n'existe pas
 *
 * Équivalent du POST dans `revocation()` dans app.py : ajoute l'identifiant
 * du credential à la liste de révocation walt.id et met à jour le registre.
 */
export async function revoquerCitoyen({ niu, motif }) {
  const { data } = await apiClient.post("/revocations", { niu, motif });
  return data;
}
