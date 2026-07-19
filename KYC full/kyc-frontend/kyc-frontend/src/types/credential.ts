import type { Citoyen } from "./citoyen";

// credentialSubject envoye a l'issuer (equiv. mapping dans kyc_pipeline.py / agent_terminal.py)
export interface CredentialSubject {
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
  cin: string;
  niu?: string;
  nationality?: string;
  [key: string]: unknown;
}

export type StatutCredential = "ACTIF" | "REVOQUE" | "EN_ATTENTE";

// equiv. d'une entree de state/registre_national.json
export interface RegistreEntry {
  niu: string;
  nin: string;
  nom: string;
  prenom: string;
  credential_id: string;
  date_enrolement: string;
  agent_id: string;
  statut: StatutCredential;
  date_revocation?: string;
  motif?: string;
}

// equiv. output/cartes/credential_<niu>.json
export interface CredentialCarte {
  credential_jwt: string;
  credential_id: string;
  citoyen: Citoyen;
}
