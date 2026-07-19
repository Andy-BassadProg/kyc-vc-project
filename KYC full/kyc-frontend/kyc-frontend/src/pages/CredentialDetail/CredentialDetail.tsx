import { useParams, Link } from "react-router-dom";
import { useCitoyens } from "@/hooks/useCitoyens";
import Badge from "@/components/ui/Badge";

// Fiche detail d'un citoyen/credential : statut, historique, revocation
export default function CredentialDetail() {
  const { niu } = useParams();
  const { all } = useCitoyens();
  const entry = all.find((c) => c.niu === niu);

  if (!entry) {
    return (
      <p className="text-sm text-gray-500">
        Citoyen introuvable. <Link to="/registre" className="underline">Retour au registre</Link>
      </p>
    );
  }

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <Link to="/registre" className="text-sm text-slate-600 underline">← Retour au registre</Link>
      <div className="border rounded-lg p-6 bg-white flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{entry.prenom} {entry.nom}</h2>
          <Badge statut={entry.statut} />
        </div>
        <table className="text-sm">
          <tbody>
            <tr><td className="pr-4 py-1 text-gray-500">NIU</td><td className="font-mono">{entry.niu}</td></tr>
            <tr><td className="pr-4 py-1 text-gray-500">NIN</td><td>{entry.nin}</td></tr>
            <tr><td className="pr-4 py-1 text-gray-500">Credential ID</td><td className="break-all">{entry.credential_id}</td></tr>
            <tr><td className="pr-4 py-1 text-gray-500">Date d'enrôlement</td><td>{new Date(entry.date_enrolement).toLocaleString()}</td></tr>
            {entry.date_revocation && (
              <>
                <tr><td className="pr-4 py-1 text-gray-500">Date de révocation</td><td>{new Date(entry.date_revocation).toLocaleString()}</td></tr>
                <tr><td className="pr-4 py-1 text-gray-500">Motif</td><td>{entry.motif}</td></tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
