import apiClient from "./client";

/**
 * Vérification hors-ligne d'un credential.
 *
 * Backend Spring Boot attendu :
 *   POST /api/verifications
 *   Body : multipart/form-data avec soit :
 *     - un champ "fichier" (le .json téléchargé lors de l'enrôlement), soit
 *     - un champ "jwt" (le jeton JWT collé directement)
 *
 *   -> 200 OK
 *      {
 *        "valide": true,
 *        "sujet": { "firstName": string, "lastName": string, "birthDate": string, "city": string, "cin": string, "niu": string|null },
 *        "id": string   // identifiant du credential
 *      }
 *      ou
 *      { "valide": false, "erreur": string }
 *
 * Reprend `verification()` dans app.py, qui appelle `verify_offline()` sur
 * les clés d'émetteur déjà synchronisées localement — vérification 100%
 * locale, sans appel réseau à walt.id.
 */
export async function verifierCredential({ fichier, jwt }) {
  const formData = new FormData();
  if (fichier) {
    formData.append("fichier", fichier);
  }
  if (jwt) {
    formData.append("jwt", jwt);
  }
  const { data } = await apiClient.post("/verifications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
