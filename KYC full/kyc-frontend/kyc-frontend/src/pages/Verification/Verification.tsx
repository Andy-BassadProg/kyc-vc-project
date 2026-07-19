import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import VerificationResultat from "./VerificationResultat";
import * as verifierApi from "@/services/api/verifierApi";
import * as walletApi from "@/services/api/walletApi";
import { useAuthStore } from "@/store/authStore";
import type { VerificationSessionResult } from "@/types/api";

// Verification en ligne d'un credential (equiv. kyc_pipeline.py verify)
export default function Verification() {
  const [credentialId, setCredentialId] = useState("");
  const [result, setResult] = useState<VerificationSessionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { walletId, did } = useAuthStore();

  async function verifier() {
    if (!walletId || !did || !credentialId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { raw, state } = await verifierApi.createVerificationRequest(
        import.meta.env.VITE_CREDENTIAL_TYPE
      );
      await walletApi.usePresentationRequest(walletId, did, raw, [credentialId]);
      const session = await verifierApi.getSessionResult(state);
      setResult(session);
    } catch (err) {
      console.error(err);
      setError("Échec de la vérification. Vérifiez que le verifier (port 7003) est accessible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <h2 className="text-xl font-semibold">Vérification en ligne</h2>
      <p className="text-sm text-gray-500">
        Équivalent de <code>kyc_pipeline.py verify --credential-id ...</code>.
      </p>
      <Input
        label="ID du credential" value={credentialId}
        onChange={(e) => setCredentialId(e.target.value)} placeholder="urn:uuid:..."
      />
      <Button onClick={verifier} disabled={loading || !credentialId}>
        {loading ? "Vérification en cours..." : "Vérifier"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && <VerificationResultat session={result} />}
    </div>
  );
}
