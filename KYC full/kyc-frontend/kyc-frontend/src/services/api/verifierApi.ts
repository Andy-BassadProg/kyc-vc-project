import { verifierClient } from "./client";
import type { VerificationSessionResult } from "@/types/api";

// POST /openid4vc/verify — equiv. debut de verify_credential() (kyc_pipeline.py)
export async function createVerificationRequest(
  credentialType: string
): Promise<{ raw: string; state: string }> {
  const { data } = await verifierClient.post(
    "/openid4vc/verify",
    { request_credentials: [{ format: "jwt_vc_json", type: credentialType }] },
    { responseType: "text" }
  );
  const raw = (data as string).trim();
  if (!raw.startsWith("openid4vp://")) {
    throw new Error(`Réponse de génération de demande inattendue : ${raw}`);
  }
  const state = raw.split("state=")[1]?.split("&")[0];
  if (!state) throw new Error("Aucun paramètre state trouvé dans la demande de vérification");
  return { raw, state };
}

// GET /openid4vc/session/{state} — equiv. lecture du resultat de session
export async function getSessionResult(state: string): Promise<VerificationSessionResult> {
  const { data } = await verifierClient.get(`/openid4vc/session/${state}`);
  return data;
}
