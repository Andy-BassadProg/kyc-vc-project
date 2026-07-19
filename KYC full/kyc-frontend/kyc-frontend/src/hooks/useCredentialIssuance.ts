import { useState } from "react";
import * as issuerApi from "@/services/api/issuerApi";
import * as walletApi from "@/services/api/walletApi";
import { addCitoyen } from "@/services/api/registreApi";
import { getOrCreateIssuer } from "@/services/api/issuerCache";
import { useAuthStore } from "@/store/authStore";
import type { Citoyen } from "@/types/citoyen";
import type { CredentialSubject } from "@/types/credential";

// Enchaine ensureIssuer -> issueCredentialOffer -> useOfferRequest -> registre local
// (equiv. AgentTerminal._emettre_credential + kyc_pipeline.py issue)
export function useCredentialIssuance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { walletId, did } = useAuthStore();

  async function emettre(citoyen: Citoyen): Promise<string | null> {
    if (!walletId || !did) {
      setError("Session agent expirée, reconnectez-vous.");
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const issuer = await getOrCreateIssuer();

      const subject: CredentialSubject = {
        firstName: citoyen.prenom,
        lastName: citoyen.nom,
        birthDate: citoyen.date_naissance.replaceAll("/", "-"),
        city: citoyen.lieu_naissance,
        cin: citoyen.nin,
        niu: citoyen.niu,
        nationality: citoyen.nationalite,
      };

      const offer = await issuerApi.issueCredentialOffer(
        issuer,
        subject,
        import.meta.env.VITE_CREDENTIAL_CONFIGURATION_ID
      );
      const received = await walletApi.useOfferRequest(walletId, did, offer);
      const credentialId = received[0]?.id;
      if (!credentialId) throw new Error("Aucun credential reçu par le wallet");

      addCitoyen({
        niu: citoyen.niu,
        nin: citoyen.nin,
        nom: citoyen.nom,
        prenom: citoyen.prenom,
        credential_id: credentialId,
        date_enrolement: new Date().toISOString(),
        agent_id: walletId,
        statut: "ACTIF",
      });

      return credentialId;
    } catch (err) {
      console.error(err);
      setError("Échec de l'émission du credential.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { emettre, loading, error };
}
