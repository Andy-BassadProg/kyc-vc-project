import apiClient from "./client";

/**
 * Enrôlement / émission de credential.
 *
 * Backend Spring Boot attendu :
 *   POST /api/enrolements
 *   Body (JSON) :
 *     {
 *       "prenom": string, "nom": string, "nin": string,
 *       "dateNaissance": string, "lieuNaissance": string, "nationalite": string,
 *       "genre": "M" | "F", "pere": string, "mere": string, "profession": string,
 *       "adresse": string, "document": string, "numDocument": string,
 *       "biometrieConfirmee": boolean
 *     }
 *
 *   -> 201 Created
 *      {
 *        "citoyen": { ...champs ci-dessus, "niu": string, "photoHash": string, "empreinteHash": string },
 *        "credentialId": string,
 *        "fichier": string   // nom du fichier de credential téléchargeable
 *      }
 *
 *   -> 400 Bad Request si champs obligatoires manquants ou biométrie non confirmée
 *      { "message": string, "erreurs": string[] }   // erreurs = noms de champs en échec
 *
 *   -> 502 Bad Gateway si walt.id (wallet-api / issuer-api) est injoignable
 *      { "message": string }
 *
 * Reprend la logique de `enrolement()` dans app.py : génération du NIU,
 * hash photo/empreinte (simulés), login wallet walt.id, émission du
 * credential vérifiable, écriture au registre national. Toute cette
 * orchestration walt.id se fait désormais côté Spring Boot.
 */
export async function creerEnrolement(payload) {
  const { data } = await apiClient.post("/enrolements", payload);
  return data;
}

/**
 *   GET /api/enrolements/{niu}/carte
 *   -> 200 OK, fichier JSON en pièce jointe (Content-Disposition: attachment)
 *   -> 404 Not Found si aucun credential pour ce NIU
 *
 * Équivalent de `telecharger_carte()` dans app.py.
 */
export async function telechargerCarte(niu) {
  const response = await apiClient.get(`/enrolements/${encodeURIComponent(niu)}/carte`, {
    responseType: "blob",
  });
  return response.data;
}
