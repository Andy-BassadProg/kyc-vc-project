// Registre local (localStorage) — cote frontend il n'existe pas d'API REST pour
// state/registre_national.json, state/issuer_public_keys.json ou
// state/revocation_list.json (ce sont des fichiers manipules directement par les
// scripts Python). On reproduit la meme structure de donnees ici, en persistant
// dans le navigateur pour permettre la demo et le mode offline.
import type { RegistreEntry, StatutCredential } from "@/types/credential";

const REGISTRE_KEY = "kyc_registre_national";
const ISSUER_KEYS_KEY = "kyc_issuer_public_keys";
const REVOCATION_KEY = "kyc_revocation_list";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Registre national (equiv. state/registre_national.json) ---

export function listCitoyens(): RegistreEntry[] {
  return readJson<RegistreEntry[]>(REGISTRE_KEY, []);
}

export function findCitoyen(query: string): RegistreEntry | undefined {
  const q = query.trim();
  return listCitoyens().find(
    (c) => c.niu.toUpperCase() === q.toUpperCase() || c.nin === q
  );
}

export function addCitoyen(entry: RegistreEntry): void {
  const list = listCitoyens();
  list.push(entry);
  writeJson(REGISTRE_KEY, list);
}

// equiv. revoke_agent.py
export function revoquerCitoyen(niuOuNin: string, motif: string): RegistreEntry | null {
  const list = listCitoyens();
  const target = list.find((c) => c.niu === niuOuNin || c.nin === niuOuNin);
  if (!target) return null;

  target.statut = "REVOQUE" as StatutCredential;
  target.date_revocation = new Date().toISOString();
  target.motif = motif;
  writeJson(REGISTRE_KEY, list);

  const revList = getCachedRevocationList();
  if (!revList.revokedIndices.includes(target.credential_id)) {
    revList.revokedIndices.push(target.credential_id);
    revList.lastUpdated = new Date().toISOString();
    writeJson(REVOCATION_KEY, revList);
  }
  return target;
}

// --- Clés publiques émetteur (equiv. state/issuer_public_keys.json) ---

export function getCachedIssuerKeys(): Record<string, JsonWebKey> {
  return readJson(ISSUER_KEYS_KEY, {});
}
export function cacheIssuerKeys(keys: Record<string, JsonWebKey>): void {
  writeJson(ISSUER_KEYS_KEY, keys);
}

// --- Liste de révocation (equiv. state/revocation_list.json) ---

export interface RevocationList {
  revokedIndices: string[];
  lastUpdated: string;
}

export function getCachedRevocationList(): RevocationList {
  return readJson<RevocationList>(REVOCATION_KEY, { revokedIndices: [], lastUpdated: "" });
}
export function cacheRevocationList(list: RevocationList): void {
  writeJson(REVOCATION_KEY, list);
}
