import { Link } from "react-router-dom";
import { useCitoyens } from "@/hooks/useCitoyens";
import CredentialCard from "@/components/credential/CredentialCard";

// Vue d'ensemble : nb citoyens enroles, credentials actifs/revoques, derniers evenements
export default function Dashboard() {
  const { all } = useCitoyens();
  const actifs = all.filter((c) => c.statut === "ACTIF").length;
  const revoques = all.filter((c) => c.statut === "REVOQUE").length;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Tableau de bord</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-2xl font-bold">{all.length}</p>
          <p className="text-sm text-gray-500">Citoyens enrôlés</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-2xl font-bold text-green-600">{actifs}</p>
          <p className="text-sm text-gray-500">Credentials actifs</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-2xl font-bold text-red-600">{revoques}</p>
          <p className="text-sm text-gray-500">Révoqués</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Derniers enrôlements</h3>
          <Link to="/registre" className="text-sm text-slate-600 underline">Voir le registre complet</Link>
        </div>
        {all.slice(-5).reverse().map((c) => <CredentialCard key={c.niu} entry={c} />)}
        {all.length === 0 && <p className="text-sm text-gray-400">Aucun citoyen enrôlé pour le moment.</p>}
      </div>

      <div className="flex gap-3">
        <Link to="/enrolement/nouveau" className="text-sm px-4 py-2 rounded bg-slate-900 text-white">
          + Nouvel enrôlement
        </Link>
        <Link to="/verification-offline" className="text-sm px-4 py-2 rounded border border-gray-300">
          Vérification offline
        </Link>
      </div>
    </div>
  );
}
