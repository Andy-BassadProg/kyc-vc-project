import { useEffect, useState } from "react";
import { getRegistre } from "../api/registre";
import { telechargerCarte } from "../api/enrolement";
import { useFlash } from "../context/FlashContext";

export default function Registre() {
  const { pushFlash } = useFlash();
  const [q, setQ] = useState("");
  const [registre, setRegistre] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerRegistre(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function chargerRegistre(recherche) {
    setChargement(true);
    try {
      const data = await getRegistre(recherche);
      setRegistre(data);
    } catch (err) {
      pushFlash("Impossible de charger le registre national.", "error");
    } finally {
      setChargement(false);
    }
  }

  function soumettreRecherche(e) {
    e.preventDefault();
    chargerRegistre(q);
  }

  async function telecharger(niu) {
    try {
      const blob = await telechargerCarte(niu);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `credential_${niu}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      pushFlash("Fichier de credential introuvable pour ce NIU.", "error");
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Registre national</h1>
        <p className="lede">
          {registre.length} résultat{registre.length !== 1 ? "s" : ""}
          {q ? ` pour « ${q} »` : ""}
        </p>
      </div>

      <form className="card search-form" onSubmit={soumettreRecherche}>
        <input
          type="text"
          placeholder="Rechercher par nom, NIU ou NIN"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="btn">
          Rechercher
        </button>
      </form>

      <div className="card table-card">
        {chargement ? (
          <p className="loading">Chargement…</p>
        ) : registre.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>NIU</th>
                <th>NIN</th>
                <th>Enrôlé le</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {registre.map((c) => (
                <tr key={c.niu}>
                  <td>{c.nom} {c.prenom}</td>
                  <td className="mono">{c.niu}</td>
                  <td>{c.nin}</td>
                  <td>{(c.dateEnrolement || "").slice(0, 10)}</td>
                  <td>
                    <span className={`badge ${c.statut === "ACTIF" ? "badge-ok" : "badge-danger"}`}>{c.statut}</span>
                  </td>
                  <td>
                    <button className="btn btn-small" onClick={() => telecharger(c.niu)}>
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">Aucun citoyen enregistré{q ? " pour cette recherche" : ""}.</p>
        )}
      </div>
    </>
  );
}
