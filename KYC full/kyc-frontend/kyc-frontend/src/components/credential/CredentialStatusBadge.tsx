import Badge from "@/components/ui/Badge";
import type { StatutCredential } from "@/types/credential";

export default function CredentialStatusBadge({ statut }: { statut: StatutCredential }) {
  return <Badge statut={statut} />;
}
