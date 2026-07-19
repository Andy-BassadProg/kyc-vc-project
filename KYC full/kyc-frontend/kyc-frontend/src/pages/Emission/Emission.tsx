import { useState } from "react";
import FileDropzone from "@/components/forms/FileDropzone";
import Button from "@/components/ui/Button";
import EmissionResultat from "./EmissionResultat";
import * as issuerApi from "@/services/api/issuerApi";
import * as walletApi from "@/services/api/walletApi";
import { getOrCreateIssuer } from "@/services/api/issuerCache";
import { useAuthStore } from "@/store/authStore";
import type { CredentialSubject } from "@/types/credential";

// Emission d'un credential a partir d'un JSON (equiv. kyc_pipeline.py issue --data ...)
export default function Emission() {
  const [subject, setSubject] = useState<CredentialSubject | null>(null);
  const [credentialId, setCredentialId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { walletId, did } = useAuthStore();

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setSubject(JSON.parse(reader.result as string));
        setCredentialId(null);
        setError(null);
      } catch {
        setError("Fichier JSON invalide.");
      }
    };
    reader.readAsText(file);
  }

  async function emettre() {
    if (!subject || !walletId || !did) return;
    setLoading(true);
    setError(null);
    try {
      const issuer = await getOrCreateIssuer();
      const offer = await issuerApi.issueCredentialOffer(
        issuer,
        subject,
        import.meta.env.VITE_CREDENTIAL_CONFIGURATION_ID
      );
      const received = await walletApi.useOfferRequest(walletId, did, offer);
      setCredentialId(received[0]?.id ?? null);
    } catch (err) {
      console.error(err);
      setError("Échec de l'émission du credential.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <h2 className="text-xl font-semibold">Émission de credential</h2>
      <p className="text-sm text-gray-500">
        Équivalent de <code>kyc_pipeline.py issue --data ...</code> : déposez un JSON
        de données (firstName, lastName, birthDate, city, cin, ...).
      </p>
      <FileDropzone onFile={handleFile} label="Déposez le fichier JSON des données du citoyen" />
      {subject && (
        <pre className="bg-gray-50 border rounded p-3 text-xs overflow-x-auto">
          {JSON.stringify(subject, null, 2)}
        </pre>
      )}
      {subject && !credentialId && (
        <Button onClick={emettre} disabled={loading}>
          {loading ? "Émission en cours..." : "Émettre le credential"}
        </Button>
      )}
      {credentialId && subject && <EmissionResultat credentialId={credentialId} subject={subject} />}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
