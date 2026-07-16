# KYC Offline — Front-end React

Portage en React de l'interface web KYC Offline (initialement en Flask +
Jinja2). Ce front-end est fait pour être branché sur un **backend Spring
Boot**, qui sera le seul composant à dialoguer avec walt.id (wallet-api,
issuer-api, verifier-api). React ne fait plus aucun appel direct à walt.id :
tout passe par les endpoints REST `/api/...` décrits ci-dessous.

## Démarrer

```bash
npm install
npm run dev       # serveur de dev, http://localhost:5173
npm run build     # build de prod dans dist/
```

## Configuration de l'URL du backend

Le front lit l'URL de base de l'API dans la variable d'environnement
`VITE_API_BASE_URL` (fichier `.env`, déjà pré-rempli) :

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Changez cette valeur pour pointer vers votre Spring Boot (local, docker,
serveur distant...). Aucun autre fichier n'a besoin d'être modifié : tous
les appels passent par `src/api/client.js`.

Si vous préférez éviter de configurer CORS côté Spring Boot en dev, un
proxy Vite est prêt (commenté) dans `vite.config.js`.

## Structure du projet

```
src/
  api/            <- un module par domaine métier, un seul point d'entrée HTTP (client.js)
    client.js         instance axios centrale (VITE_API_BASE_URL)
    dashboard.js       GET /api/dashboard
    enrolement.js      POST /api/enrolements, GET /api/enrolements/{niu}/carte
    verification.js   POST /api/verifications
    revocation.js     GET /api/citoyens/recherche, POST /api/revocations
    registre.js       GET /api/registre
  context/
    FlashContext.jsx  équivalent de flash() de Flask (messages succès/erreur)
  components/
    Layout.jsx        topbar + nav + footer + zone de messages, communs à toutes les pages
  pages/
    Dashboard.jsx      "/"            (ex index.html)
    Enrolement.jsx     "/enrolement"  (ex enrolement.html + enrolement_resultat.html)
    Verification.jsx  "/verification" (ex verification.html)
    Revocation.jsx     "/revocation"  (ex revocation.html)
    Registre.jsx       "/registre"    (ex registre.html)
  index.css           styles (portés à l'identique depuis static/style.css)
```

Chaque fichier de `src/api/` contient en commentaire le contrat REST exact
attendu (méthode, chemin, corps de requête, forme de la réponse), déduit
de la logique de l'ancien `app.py`. C'est la spec à implémenter côté
contrôleurs Spring Boot.

## Contrat d'API attendu côté Spring Boot

| Ancienne route Flask (app.py)         | Nouvel endpoint REST                          |
|----------------------------------------|-----------------------------------------------|
| `GET /` (index)                       | `GET /api/dashboard`                          |
| `GET/POST /enrolement`                | `POST /api/enrolements`                       |
| `GET /telecharger/<niu>`              | `GET /api/enrolements/{niu}/carte`            |
| `GET/POST /verification`              | `POST /api/verifications` (multipart)         |
| `GET /revocation` (recherche)         | `GET /api/citoyens/recherche?q=`             |
| `POST /revocation` (confirmation)     | `POST /api/revocations`                       |
| `GET /registre`                       | `GET /api/registre?q=`                        |

Toute la logique métier qui était dans `kyc_pipeline.py` /
`verifier_offline_final.py` (login wallet, émission de credential walt.id,
vérification offline via les clés d'émetteur, gestion de la liste de
révocation) doit être reportée dans les services Spring Boot derrière ces
endpoints — le front n'en a plus besoin.

## Points d'attention pour le pont Spring Boot

- **CORS** : autoriser `http://localhost:5173` (dev) et l'origine de prod du front.
- **Upload de fichier** (`/api/verifications`) : `multipart/form-data`, champ
  `fichier` (le JSON de credential) ou `jwt` (texte collé) — un seul des deux
  est envoyé à la fois.
- **Téléchargement de fichier** (`/api/enrolements/{niu}/carte`) : renvoyer le
  JSON avec l'en-tête `Content-Disposition: attachment; filename="credential_{niu}.json"`.
- **Erreurs** : le front lit `err.response.data.message` et
  `err.response.data.erreurs` (tableau de noms de champs) pour les erreurs
  400 de l'enrôlement — gardez cette forme de réponse pour que les messages
  s'affichent correctement.

## Ce qui n'a pas été repris

Les scripts CLI (`agent_terminal.py`, `revoke_agent.py`,
`onboard_issuer_permanent.py`, `update_issuer_keys.py`, ...) et la page
`setup_required.html` (spécifique à la config locale du Flask) n'ont pas
d'équivalent React : ce sont des opérations d'administration/bootstrap qui
resteront côté backend (scripts, ou futurs endpoints d'admin Spring Boot si besoin).
