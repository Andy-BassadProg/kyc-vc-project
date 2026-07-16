import { useState } from "react";
import { rechercherCitoyen, revoquerCitoyen } from "../api/revocation";
import { useFlash } from "../context/FlashContext";

const MOTIFS = [
  { value: "DEMANDE_ADMINISTRATIVE", label: "Demande administrative" },
  { value: "PERTE", label: "Perte du document" },
  { value: "VOL", label: "Vol" },
  { value: "DECES", label: "Décès" },
  { value: "ERREUR", label: "Erreur d'enrôlement" },
];

export default function Revocation() {
  const { pushFlash } = useFlash();
  const [recherche, setRecherche] = useState("");
  const [cible, setCible] = useState(null);
  const [motif, setMotif] = useState(MOTIFS[0].value);
  const [confirmer, setConfirmer] = useState(false);
  const [recherchant, setRecherchant] = useState(false);
  const [revoquant, setRevoquant] = useState(false);

  async function lancerRecherche(e) {
    e.preventDefault();
    if (!recherche.trim()) return;
    setRecherchant(true);
    setCible(null);
    try {
      const data = await rechercherCitoyen(recherche.trim());
      setCible(data);
    } catch (err) {
      if (err?.response?.status === 404) {
        pushFlash("Aucun citoyen trouvé avec ce NIU ou NIN.", "error");
      } else {
        pushFlash("Impossible de contacter le service de recherche.", "error");
      }
    } finally {
      setRecherchant(false);
    }
  }

  async function confirmerRevocation(e) {
    e.preventDefault();
    if (!confirmer || !cible) return;
    setRevoquant(true);
    try {
      const data = await revoquerCitoyen({ niu: cible.niu, motif });
      pushFlash(`Identité ${cible.niu} révoquée avec succès.`, "success");
      setCible({ ...cible, statut: data.statut, dateRevocation: data.dateRevocation });
      setConfirmer(false);
    } catch (err) {
      pushFlash("Citoyen introuvable, révocation annulée.", "error");
    } finally {
      setRevoquant(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Révoquer une identité</h1>
        <p className="lede">À utiliser en cas de perte, de décès ou de demande administrative.</p>
      </div>

      <form className="card form" onSubmit={lancerRecherche}>
        <fieldset>
          <legend>Rechercher un citoyen</legend>
          <label className="field">
            <span>NIU ou NIN</span>
            <input type="text" value={recherche} onChange={(e) => setRecherche(e.target.value)} required />
          </label>
        </fieldset>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={recherchant}>
            {recherchant ? "Recherche…" : "Rechercher"}
          </button>
        </div>
      </form>

      {cible && (
        <div className="card">
          <h2>Citoyen trouvé</h2>
          <dl className="summary">
            <dt>Nom</dt>
            <dd>{cible.nom} {cible.prenom}</dd>
            <dt>NIU</dt>
            <dd className="mono">{cible.niu}</dd>
            <dt>NIN</dt>
            <dd>{cible.nin}</dd>
            <dt>Statut</dt>
            <dd>
              <span className={`badge ${cible.statut === "ACTIF" ? "badge-ok" : "badge-danger"}`}>{cible.statut}</span>
            </dd>
          </dl>

          {cible.statut === "ACTIF" ? (
            <form className="form" onSubmit={confirmerRevocation}>
              <label className="field">
                <span>Motif</span>
                <select value={motif} onChange={(e) => setMotif(e.target.value)}>
                  {MOTIFS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="checkbox">
                <input type="checkbox" checked={confirmer} onChange={(e) => setConfirmer(e.target.checked)} required />
                <span>Je confirme la révocation de cette identité</span>
              </label>
              <div className="form-actions">
                <button type="submit" className="btn btn-danger" disabled={!confirmer || revoquant}>
                  {revoquant ? "Révocation…" : "Révoquer définitivement"}
                </button>
              </div>
            </form>
          ) : (
            <p className="hint">
              Cette identité est déjà révoquée
              {cible.dateRevocation ? ` depuis le ${cible.dateRevocation.slice(0, 10)}` : ""}.
            </p>
          )}
        </div>
      )}
    </>
  );
}
