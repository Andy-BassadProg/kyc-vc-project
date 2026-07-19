# kyc-vc-project — backend

Ce "backend" ne contient pas de code métier maison : le frontend
(`kyc-frontend`) parle **directement** aux 3 services open source
[walt.id identity](https://github.com/walt-id/waltid-identity) (wallet,
issuer, verifier), qui implémentent OpenID4VCI / OpenID4VP pour
l'émission et la vérification de credentials vérifiables (VC).

Ce dossier fournit uniquement ce qu'il faut pour faire tourner ces 3
services localement, avec les ports attendus par le front.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose (v2, `docker compose ...`)

## Démarrage

```bash
docker compose up -d
docker compose ps      # les 3 services doivent etre "healthy"
```

| Service        | Port | Rôle                                                |
|----------------|------|------------------------------------------------------|
| `wallet-api`   | 7001 | comptes/wallets custodiaux, DIDs, credentials         |
| `issuer-api`   | 7002 | émission de credentials (OID4VCI)                     |
| `verifier-api` | 7003 | vérification/présentation de credentials (OID4VP)     |

Swagger de chaque service : `http://localhost:<port>/swagger`.

## Lien avec le frontend

Le frontend (`kyc-frontend`) ne fait **aucun appel** vers un serveur
maison : `src/services/api/client.ts` définit 3 clients axios qui
pointent, par défaut, vers le proxy Vite (`vite.config.ts`), lequel
redirige vers ces 3 conteneurs :

```
front (localhost:5173) --/api/wallet--->   proxy Vite   --->  localhost:7001 (wallet-api)
                        --/api/issuer--->   proxy Vite   --->  localhost:7002 (issuer-api)
                        --/api/verifier-->  proxy Vite   --->  localhost:7003 (verifier-api)
```

Ce proxy évite tout problème de CORS en développement. Il n'y a donc
rien à coder côté backend : lancer `docker compose up -d` **avant**
de démarrer `npm run dev` côté front suffit à relier les deux.

Correspondance pages du front <-> service/endpoint walt.id :

| Page frontend                  | Service      | Endpoint principal                                              |
|----------------------------------|--------------|-------------------------------------------------------------------|
| `pages/Login`                    | wallet-api   | `POST /wallet-api/auth/register` puis `/auth/login`               |
| `pages/Enrolement`, `Emission`   | issuer-api   | `POST /onboard/issuer`, `POST /openid4vc/jwt/issue`                |
| `pages/Enrolement`, `Emission`   | wallet-api   | `POST /wallet-api/wallet/{id}/exchange/useOfferRequest`            |
| `pages/Verification`             | verifier-api | `POST /openid4vc/verify`, `GET /openid4vc/session/{state}`         |
| `pages/Verification`             | wallet-api   | `POST /wallet-api/wallet/{id}/exchange/usePresentationRequest`     |
| `pages/VerificationOffline`      | — 100% navigateur, à partir de fichiers JSON exportés (clés publiques + liste de révocation), aucun appel réseau |
| `pages/Registre`, `Revocation`, `Dashboard` | — registre local `localStorage`, pas d'API REST |

## Arrêt / nettoyage

```bash
docker compose down          # arrête les services (garde les données)
docker compose down -v       # arrête et supprime aussi le volume wallet-data
```

## Dépannage

- **`ECONNREFUSED` côté front** : vérifiez `docker compose ps` — les 3
  services doivent être `healthy` avant de vous connecter (~20-30s au
  premier démarrage, téléchargement des images inclus).
- **"Aucun wallet trouvé" après connexion** : le compte démo vient
  d'être créé et n'a pas encore de wallet par défaut ; relancez la
  connexion une seconde fois.
- **Changer les ports** : si 7001/7002/7003 sont déjà utilisés sur
  votre machine, modifiez le mapping `"HOST:CONTAINER"` dans
  `docker-compose.yml` **et** les cibles correspondantes dans
  `kyc-frontend/vite.config.ts`.
