import { issuerClient } from "./client";
import type { IssuerOnboardResponse } from "@/types/api";
import type { CredentialSubject } from "@/types/credential";

// POST /onboard/issuer — equiv. ensure_issuer() / onboard_issuer_permanent.py
export async function onboardIssuer(): Promise<IssuerOnboardResponse> {
  const { data } = await issuerClient.post("/onboard/issuer", {
    key: { backend: "jwk", keyType: "secp256r1" },
    did: { method: "key" },
  });
  return data;
}

// POST /openid4vc/jwt/issue — equiv. issue_credential() (kyc_pipeline.py)
// Retourne l'offre brute "openid-credential-offer://..."
export async function issueCredentialOffer(
  issuer: IssuerOnboardResponse,
  subject: CredentialSubject,
  credentialConfigurationId: string
): Promise<string> {
  const credentialId = `urn:uuid:${crypto.randomUUID()}`;

  const body = {
    issuerKey: issuer.issuerKey,
    issuerDid: issuer.issuerDid,
    credentialConfigurationId,
    credentialData: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", "IdentityCredential"],
      id: credentialId,
      issuer: { id: issuer.issuerDid },
      credentialSubject: subject,
    },
    mapping: { id: "<uuid>", issuer: { id: "<issuerDid>" } },
  };

  const { data } = await issuerClient.post("/openid4vc/jwt/issue", body, {
    responseType: "text",
  });
  const raw = (data as string).trim();
  if (!raw.startsWith("openid-credential-offer://")) {
    throw new Error(`Réponse d'émission inattendue : ${raw}`);
  }
  return raw;
}
