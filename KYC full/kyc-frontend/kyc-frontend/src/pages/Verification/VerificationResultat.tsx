import CredentialSubjectTable from "@/components/credential/CredentialSubjectTable";
import type { VerificationSessionResult } from "@/types/api";

export default function VerificationResultat({ session }: { session: VerificationSessionResult }) {
  const valid = !!session.verificationResult;
  let subject: Record<string, unknown> | undefined;
  const results = session.policyResults?.results ?? [];
  for (const entry of results) {
    if (entry.credential === "IdentityCredential") {
      for (const policy of entry.policyResults ?? []) {
        subject = policy.result?.vc?.credentialSubject;
      }
    }
  }

  return (
    <div className={`border rounded-lg p-4 ${valid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
      <p className={`font-medium mb-2 ${valid ? "text-green-700" : "text-red-700"}`}>
        {valid ? "✓ Credential VALIDE" : "✗ Credential INVALIDE"}
      </p>
      {subject && <CredentialSubjectTable subject={subject} />}
      {!valid && !subject && (
        <p className="text-xs text-gray-500">
          Aucun tokenResponse reçu = la présentation n'est pas arrivée jusqu'au verifier.
        </p>
      )}
    </div>
  );
}
