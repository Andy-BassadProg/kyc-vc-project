import CredentialSubjectTable from "@/components/credential/CredentialSubjectTable";
import type { CredentialSubject } from "@/types/credential";

export default function EmissionResultat({
  credentialId, subject,
}: { credentialId: string; subject: CredentialSubject }) {
  return (
    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
      <p className="font-medium text-green-700 mb-2">✓ Credential émis et stocké avec succès</p>
      <p className="text-xs text-gray-500 mb-3 break-all">ID : {credentialId}</p>
      <CredentialSubjectTable subject={subject} />
    </div>
  );
}
