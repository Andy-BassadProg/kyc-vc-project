import * as issuerApi from "./issuerApi";
import type { IssuerOnboardResponse } from "@/types/api";

const ISSUER_CACHE_KEY = "kyc_issuer_permanent";

// Emetteur "permanent" mis en cache localement pour eviter de le recreer a
// chaque emission (equiv. ensure_issuer() / onboard_issuer_permanent.py).
// Partage entre useCredentialIssuance (flux Enrolement) et Emission (flux
// import JSON) pour eviter de dupliquer la logique de cache.
export async function getOrCreateIssuer(): Promise<IssuerOnboardResponse> {
  const cached = localStorage.getItem(ISSUER_CACHE_KEY);
  if (cached) return JSON.parse(cached) as IssuerOnboardResponse;

  const issuer = await issuerApi.onboardIssuer();
  localStorage.setItem(ISSUER_CACHE_KEY, JSON.stringify(issuer));
  return issuer;
}
