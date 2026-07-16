import { useState } from "react";
import { verifierCredential } from "../api/verification";
import { useFlash } from "../context/FlashContext";

export default function Verification() {
  const { pushFlash } = useFlash();
  const [fichier, setFichier] = useState(null);
  const [jwtColle, setJwtColle] = useState("");
  const [resultat, setResultat] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e) {
    e.preventDefault();

    if (!fichier && !jwtColle.trim()) {
      pushFlash("Fournissez un fichier de credential ou collez le jeton JWT.", "error");
      return;
    }

    setEnvoi(true);
    setResultat(null);
    try {
      const data = await verifierCredential({ fichier, jwt: jwtColle.trim() || undefined });
      setResultat(data);
    } catch (err) {
      const message = err?.response?.data?.message || "Le fichier fourni n'est pas valide ou le service est injoignable.";
      pushFlash(message, "error");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Vérifier une identité</h1>
        <p className="lede">Vérification cryptographique 100% locale — aucune connexion internet requise.</p>
      </div>

      <form className="card form" onSubmit={soumettre}>
        <fieldset>
          <legend>Source du credential</legend>
          <label className="field">
            <span>Fichier d'identité (.json)</span>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setFichier(e.target.files?.[0] || null)}
            />
          </label>
          <p className="muted small">Ou collez directement le jeton JWT :</p>
          <label className="field">
            <textarea
              rows={3}
              placeholder="eyJhbGciOi..."
              value={jwtColle}
              onChange={(e) => setJwtColle(e.target.value)}
            />
          </label>
        </fieldset>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={envoi}>
            {envoi ? "Vérification…" : "Vérifier"}
          </button>
        </div>
      </form>

      {resultat && resultat.valide && (
        <div className="card result-card result-ok">
          <div className="result-icon">✓</div>
          <h2>Identité authentifiée</h2>
          <p className="lede">Signature valide, non expirée, non révoquée — vérification 100% locale.</p>
          <dl className="summary">
            <dt>Nom</dt>
            <dd>{resultat.sujet.lastName} {resultat.sujet.firstName}</dd>
            <dt>Naissance</dt>
            <dd>{resultat.sujet.birthDate}</dd>
            <dt>Ville</dt>
            <dd>{resultat.sujet.city}</dd>
            <dt>CIN</dt>
            <dd>{resultat.sujet.cin}</dd>
            {resultat.sujet.niu && (
              <>
                <dt>NIU</dt>
                <dd className="mono">{resultat.sujet.niu}</dd>
              </>
            )}
            <dt>Credential</dt>
            <dd className="mono small">{resultat.id}</dd>
          </dl>
        </div>
      )}

      {resultat && !resultat.valide && (
        <div className="card result-card result-danger">
          <div className="result-icon">✗</div>
          <h2>Échec de la vérification</h2>
          <p className="lede">{resultat.erreur}</p>
        </div>
      )}
    </>
  );
}
