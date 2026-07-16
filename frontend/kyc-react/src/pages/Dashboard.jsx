import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/dashboard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let annule = false;
    getDashboard()
      .then((res) => {
        if (!annule) setData(res);
      })
      .catch((e) => {
        if (!annule) setErreur(e);
      })
      .finally(() => {
        if (!annule) setChargement(false);
      });
    return () => {
      annule = true;
    };
  }, []);

  if (chargement) {
    return <p className="loading">Chargement du tableau de bord…</p>;
  }

  if (erreur) {
    return (
      <div className="card setup-card">
        <h1>Backend indisponible</h1>
        <p>Impossible de contacter l'API Spring Boot pour charger le tableau de bord.</p>
        <p className="hint">Vérifiez que le backend tourne et que VITE_API_BASE_URL pointe au bon endroit.</p>
      </div>
    );
  }

  const { stats, services, issuerReady } = data;

  return (
    <>
      <div className="page-head">
        <h1>Tableau de bord</h1>
        <p className="lede">Vue d'ensemble du guichet — enrôlements, révocations et disponibilité des services.</p>
      </div>

      <section className="grid stats-grid">
        <div className="card stat">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Identités enregistrées</span>
        </div>
        <div className="card stat">
          <span className="stat-value stat-ok">{stats.actifs}</span>
          <span className="stat-label">Actives</span>
        </div>
        <div className="card stat">
          <span className="stat-value stat-danger">{stats.revoques}</span>
          <span className="stat-label">Révoquées</span>
        </div>
      </section>

      <section className="grid two-col">
        <div className="card">
          <h2>Actions rapides</h2>
          <div className="quick-actions">
            <Link className="btn btn-primary" to="/enrolement">
              Nouvel enrôlement
            </Link>
            <Link className="btn" to="/verification">
              Vérifier une identité
            </Link>
            <Link className="btn" to="/registre">
              Consulter le registre
            </Link>
          </div>
          {stats.dernier && (
            <p className="muted small">
              Dernier enrôlement : <strong>{stats.dernier.prenom} {stats.dernier.nom}</strong>{" "}
              ({(stats.dernier.dateEnrolement || "").slice(0, 10)})
            </p>
          )}
        </div>

        <div className="card">
          <h2>État des services</h2>
          <ul className="status-list">
            <li>
              <span className={`dot ${services.wallet ? "dot-ok" : "dot-off"}`}></span>
              Portefeuille (wallet-api) — {services.wallet ? "opérationnel" : "indisponible"}
            </li>
            <li>
              <span className={`dot ${services.issuer ? "dot-ok" : "dot-off"}`}></span>
              Émetteur (issuer-api) — {services.issuer ? "opérationnel" : "indisponible"}
            </li>
            <li>
              <span className={`dot ${services.verifier ? "dot-ok" : "dot-off"}`}></span>
              Vérificateur (verifier-api) — {services.verifier ? "opérationnel" : "indisponible"}
            </li>
            <li>
              <span className={`dot ${issuerReady ? "dot-ok" : "dot-off"}`}></span>
              Autorité émettrice permanente — {issuerReady ? "configurée" : "non configurée"}
            </li>
          </ul>
          {!(services.wallet && services.issuer && services.verifier) && (
            <p className="hint">
              Certains services sont hors-ligne : l'enrôlement et la vérification en ligne peuvent échouer. La
              vérification hors-ligne (page « Vérification ») reste possible tant que les clés d'émetteur sont déjà
              synchronisées.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
