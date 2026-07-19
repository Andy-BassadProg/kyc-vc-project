import { Link } from "react-router-dom";
import { useCitoyens } from "@/hooks/useCitoyens";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

// Liste/recherche des citoyens enroles (equiv. state/registre_national.json)
export default function Registre() {
  const { citoyens, query, setQuery } = useCitoyens();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Registre national</h2>
        <Input
          placeholder="Rechercher par NIU, NIN ou nom..."
          value={query} onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">NIU</th>
            <th className="p-3">Date d'enrôlement</th>
            <th className="p-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {citoyens.map((c) => (
            <tr key={c.niu} className="border-t hover:bg-gray-50">
              <td className="p-3">
                <Link to={`/registre/${c.niu}`} className="text-slate-700 underline">
                  {c.prenom} {c.nom}
                </Link>
              </td>
              <td className="p-3 font-mono text-xs">{c.niu}</td>
              <td className="p-3">{new Date(c.date_enrolement).toLocaleDateString()}</td>
              <td className="p-3"><Badge statut={c.statut} /></td>
            </tr>
          ))}
          {citoyens.length === 0 && (
            <tr><td colSpan={4} className="p-6 text-center text-gray-400">Aucun résultat.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
