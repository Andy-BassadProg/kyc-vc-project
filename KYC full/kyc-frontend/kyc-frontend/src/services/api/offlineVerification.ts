// Port TypeScript de verifier_offline_final.py / verifier_offline_pur.py :
// verification de signature + statut de revocation, sans aucun appel reseau.
import { decodeJwt } from "@/utils/jwt";
import { verifyJwtSignature } from "@/utils/crypto";
import { getCachedIssuerKeys, getCachedRevocationList } from "./registreApi";
import type { CredentialSubject } from "@/types/credential";

export interface OfflineVerificationResult {
  valid: boolean;
  reason?: string;
  subject?: CredentialSubject;
  issuerDid?: string;
  credentialId?: string;
  revoked?: boolean;
}

export async function verifyCredentialOffline(jwtToken: string): Promise<OfflineVerificationResult> {
  let decoded;
  try {
    decoded = decodeJwt(jwtToken.trim());
  } catch {
    return { valid: false, reason: "JWT illisible ou mal formé" };
  }

  const { payload, signingInput, signature } = decoded;
  const vc = payload.vc as Record<string, any> | undefined;
  const issuerDid: string | undefined = payload.iss ?? vc?.issuer?.id;
  const credentialId: string | undefined = payload.jti ?? vc?.id;
  const subject: CredentialSubject | undefined = vc?.credentialSubject;

  const keys = getCachedIssuerKeys();
  const jwk = issuerDid ? keys[issuerDid] : undefined;
  if (!jwk) {
    return {
      valid: false,
      reason: "Clé publique de l'émetteur introuvable localement (charger issuer_public_keys.json)",
      issuerDid,
      credentialId,
      subject,
    };
  }

  const signatureOk = await verifyJwtSignature(jwk, signingInput, signature);
  if (!signatureOk) {
    return { valid: false, reason: "Signature invalide", issuerDid, credentialId, subject };
  }

  const revocationList = getCachedRevocationList();
  const revoked = credentialId ? revocationList.revokedIndices.includes(credentialId) : false;
  if (revoked) {
    return {
      valid: false,
      reason: `Credential révoqué (liste mise à jour le ${revocationList.lastUpdated || "?"})`,
      issuerDid,
      credentialId,
      subject,
      revoked: true,
    };
  }

  return { valid: true, issuerDid, credentialId, subject };
}
