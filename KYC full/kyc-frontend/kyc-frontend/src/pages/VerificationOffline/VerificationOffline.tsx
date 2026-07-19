import { useState } from "react";
import UploadCredential from "./UploadCredential";
import { verifyCredentialOffline, OfflineVerificationResult } from "@/services/api/offlineVerification";
import {
  cacheIssuerKeys, cacheRevocationList, getCachedIssuerKeys, getCachedRevocationList,
} from "@/services/api/registreApi";
import FileDropzone from "@/components/forms/FileDropzone";
import CredentialSubjectTable from "@/components/credential/CredentialSubjectTable";

// Upload d'un fichier credential + verification sans reseau
// (equiv. verifier_offline_final.py / verifier_local.py / verifier_offline_pur.py)
export default function VerificationOffline() {
  const [result, setResult] = useState<OfflineVerificationResult | null>(null);
  const [keysCount, setKeysCount] = useState(Object.keys(getCachedIssuerKeys()).length);
  const [revCount, setRevCount] = useState(getCachedRevocationList().revokedIndices.length);

  async function handleCredentialFile(file: File) {
    const text = await file.text();
    let jwt = text.trim();
    try {
      const parsed = JSON.parse(text);
      // Supporte le format output/cartes/credential_<niu>.json
      if (parsed.credential_jwt) jwt = parsed.credential_jwt;
    } catch {
      // le fichier contient directement le JWT brut
    }
    setResult(await verifyCredentialOffline(jwt));
  }

  async function handleKeysFile(file: File) {
    const data = JSON.parse(await file.text());
    cacheIssuerKeys(data);
    setKeysCount(Object.keys(data).length);
  }

  async function handleRevocationFile(file: File) {
    const data = JSON.parse(await file.text());
    cacheRevocationList(data);
    setRevCount(data.revokedIndices?.length ?? 0);
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold">Vérification offline</h2>
        <p className="text-sm text-gray-500">
          Équivalent de <code>verifier_offline_final.py</code> — aucun appel réseau,
          la signature est vérifiée localement avec les clés de l'émetteur mises en cache.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-3 bg-white">
          <p className="text-xs text-gray-500 mb-2">Clés émetteur en cache : {keysCount}</p>
          <FileDropzone onFile={handleKeysFile} label="Charger issuer_public_keys.json" />
        </div>
        <div className="border rounded-lg p-3 bg-white">
          <p className="text-xs text-gray-500 mb-2">Entrées de révocation en cache : {revCount}</p>
          <FileDropzone onFile={handleRevocationFile} label="Charger revocation_list.json" />
        </div>
      </div>

      <UploadCredential onFile={handleCredentialFile} />

      {result && (
        <div className={`border rounded-lg p-4 ${result.valid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <p className={`font-medium mb-2 ${result.valid ? "text-green-700" : "text-red-700"}`}>
            {result.valid ? "✓ VALIDE" : `✗ INVALIDE${result.reason ? " — " + result.reason : ""}`}
          </p>
          {result.subject && <CredentialSubjectTable subject={result.subject as Record<string, unknown>} />}
        </div>
      )}
    </div>
  );
}
