import { useState } from "react";
import { Link } from "react-router-dom";
import { creerEnrolement } from "../api/enrolement";
import { useFlash } from "../context/FlashContext";

const CHAMPS_INITIAUX = {
  prenom: "",
  nom: "",
  nin: "",
  dateNaissance: "",
  lieuNaissance: "",
  nationalite: "",
  genre: "M",
  pere: "",
  mere: "",
  profession: "",
  adresse: "",
  document: "",
  numDocument: "",
};

export default function Enrolement() {
  const { pushFlash } = useFlash();
  const [valeurs, setValeurs] = useState(CHAMPS_INITIAUX);
  const [biometrieConfirmee, setBiometrieConfirmee] = useState(false);
  const [erreurs, setErreurs] = useState([]);
  const [envoi, setEnvoi] = useState(false);
  const [resultat, setResultat] = useState(null);

  function majChamp(champ, valeur) {
    setValeurs((prev) => ({ ...prev, [champ]: valeur }));
  }

  function validerLocalement() {
    const manquants = ["prenom", "nom", "nin", "dateNaissance"].filter((c) => !valeurs[c].trim());
    if (!biometrieConfirmee) manquants.push("biometrieConfirmee");
    return manquants;
  }

  async function soumettre(e) {
    e.preventDefault();
    const manquants = validerLocalement();
    setErreurs(manquants);
    if (manquants.length > 0) {
      pushFlash("Merci de compléter les champs obligatoires et de confirmer la capture biométrique.", "error");
      return;
    }

    setEnvoi(true);
    try {
      const data = await creerEnrolement({ ...valeurs, biometrieConfirmee });
      setResultat(data);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Échec de l'émission du credential. Vérifiez la connexion aux services walt.id.";
      pushFlash(message, "error");
      setErreurs(err?.response?.data?.erreurs || []);
    } finally {
      setEnvoi(false);
    }
  }

  function nouvelEnrolement() {
    setValeurs(CHAMPS_INITIAUX);
    setBiometrieConfirmee(false);
    setErreurs([]);
    setResultat(null);
  }

  if (resultat) {
    const { citoyen, credentialId } = resultat;
    return (
      <div className="card result-card result-ok">
        <div className="result-icon">✓</div>
        <h1>Enrôlement réussi</h1>
        <p className="lede">
          L'identité vérifiable de <strong>{citoyen.prenom} {citoyen.nom}</strong> a été émise.
        </p>

        <dl className="summary">
          <dt>NIU</dt>
          <dd className="mono">{citoyen.niu}</dd>
          <dt>NIN</dt>
          <dd>{citoyen.nin}</dd>
          <dt>Identifiant du credential</dt>
          <dd className="mono small">{credentialId}</dd>
        </dl>

        <div className="form-actions">
          <a className="btn btn-primary" href={`${import.meta.env.VITE_API_BASE_URL}/enrolements/${citoyen.niu}/carte`}>
            Télécharger le fichier d'identité
          </a>
          <button className="btn" onClick={nouvelEnrolement}>
            Nouvel enrôlement
          </button>
          <Link className="btn" to="/registre">
            Voir le registre
          </Link>
        </div>
        <p className="hint">
          Remettez le fichier téléchargé au citoyen (clé USB, wallet mobile, etc.). Il permettra une vérification
          hors-ligne, sans connexion internet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <h1>Enrôlement d'un citoyen</h1>
        <p className="lede">
          Saisissez les informations civiles, confirmez la capture biométrique, puis validez pour émettre l'identité
          vérifiable.
        </p>
      </div>

      <form className="card form" onSubmit={soumettre}>
        <fieldset>
          <legend>Données civiles</legend>
          <div className="field-grid">
            <label className="field">
              <span>Prénom *</span>
              <input
                type="text"
                value={valeurs.prenom}
                onChange={(e) => majChamp("prenom", e.target.value)}
                required
                className={erreurs.includes("prenom") ? "field-error" : ""}
              />
            </label>
            <label className="field">
              <span>Nom *</span>
              <input
                type="text"
                value={valeurs.nom}
                onChange={(e) => majChamp("nom", e.target.value)}
                required
                className={erreurs.includes("nom") ? "field-error" : ""}
              />
            </label>
            <label className="field">
              <span>NIN (numéro d'identification national) *</span>
              <input
                type="text"
                value={valeurs.nin}
                onChange={(e) => majChamp("nin", e.target.value)}
                required
                className={erreurs.includes("nin") ? "field-error" : ""}
              />
            </label>
            <label className="field">
              <span>Date de naissance *</span>
              <input
                type="text"
                placeholder="JJ/MM/AAAA"
                value={valeurs.dateNaissance}
                onChange={(e) => majChamp("dateNaissance", e.target.value)}
                required
                className={erreurs.includes("dateNaissance") ? "field-error" : ""}
              />
            </label>
            <label className="field">
              <span>Lieu de naissance</span>
              <input
                type="text"
                value={valeurs.lieuNaissance}
                onChange={(e) => majChamp("lieuNaissance", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Nationalité</span>
              <input
                type="text"
                value={valeurs.nationalite}
                onChange={(e) => majChamp("nationalite", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Genre</span>
              <select value={valeurs.genre} onChange={(e) => majChamp("genre", e.target.value)}>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </label>
            <label className="field">
              <span>Profession</span>
              <input
                type="text"
                value={valeurs.profession}
                onChange={(e) => majChamp("profession", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Père</span>
              <input type="text" value={valeurs.pere} onChange={(e) => majChamp("pere", e.target.value)} />
            </label>
            <label className="field">
              <span>Mère</span>
              <input type="text" value={valeurs.mere} onChange={(e) => majChamp("mere", e.target.value)} />
            </label>
            <label className="field field-wide">
              <span>Adresse</span>
              <input type="text" value={valeurs.adresse} onChange={(e) => majChamp("adresse", e.target.value)} />
            </label>
            <label className="field">
              <span>Document présenté</span>
              <input
                type="text"
                placeholder="ex. Carte nationale"
                value={valeurs.document}
                onChange={(e) => majChamp("document", e.target.value)}
              />
            </label>
            <label className="field">
              <span>N° du document</span>
              <input
                type="text"
                value={valeurs.numDocument}
                onChange={(e) => majChamp("numDocument", e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Capture biométrique</legend>
          <p className="muted">Positionnez le citoyen pour la photo et l'empreinte digitale avant de continuer.</p>
          <label className={`checkbox ${erreurs.includes("biometrieConfirmee") ? "field-error" : ""}`}>
            <input
              type="checkbox"
              checked={biometrieConfirmee}
              onChange={(e) => setBiometrieConfirmee(e.target.checked)}
            />
            <span>Photo et empreinte digitale capturées</span>
          </label>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={envoi}>
            {envoi ? "Émission en cours…" : "Valider et émettre l'identité"}
          </button>
        </div>
      </form>
    </>
  );
}
