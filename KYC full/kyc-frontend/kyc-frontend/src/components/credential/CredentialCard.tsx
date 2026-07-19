import { Link } from "react-router-dom";
import type { RegistreEntry } from "@/types/credential";
import CredentialStatusBadge from "./CredentialStatusBadge";

export default function CredentialCard({ entry }: { entry: RegistreEntry }) {
  return (
    <Link
      to={`/registre/${entry.niu}`}
      className="border rounded-lg p-4 bg-white shadow-sm flex items-center justify-between hover:border-slate-300"
    >
      <div>
        <p className="font-semibold">{entry.prenom} {entry.nom}</p>
        <p className="text-xs text-gray-500">NIU : {entry.niu}</p>
        <p className="text-xs text-gray-400">Enrôlé le {new Date(entry.date_enrolement).toLocaleDateString()}</p>
      </div>
      <CredentialStatusBadge statut={entry.statut} />
    </Link>
  );
}
