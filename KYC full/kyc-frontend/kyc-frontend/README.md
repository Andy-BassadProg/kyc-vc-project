# KYC Offline — Frontend

Frontend (React + TypeScript + Vite) qui consomme directement les 3
services [walt.id identity](https://github.com/walt-id/waltid-identity)
(wallet, issuer, verifier). Voir `../kyc-vc-project/README.md` pour
faire tourner ces services (docker-compose) et comprendre la liaison
front <-> back.

## Correspondance pages <-> scripts backend

| Page frontend                          | Script / commande backend equivalent          |
|-----------------------------------------|-------------------------------------------------|
| `pages/Login`                           | `ensure_login()` dans `kyc_pipeline.py`         |
| `pages/Dashboard`                       | `state/registre_national.json` (vue globale)    |
| `pages/Enrolement`                      | `agent_terminal.py` (saisie + biometrie)        |
| `pages/Emission`                        | `kyc_pipeline.py issue --data ...`              |
| `pages/Verification`                    | `kyc_pipeline.py verify --credential-id ...`    |
| `pages/VerificationOffline`             | `verifier_offline_final.py` / `verifier_local.py` / `verifier_offline_pur.py` |
| `pages/Revocation`                      | `revoke_agent.py --niu ...`                     |
| `pages/Registre`                        | `state/registre_national.json` (liste/recherche)|
| `pages/CredentialDetail`                | fiche citoyen + `output/cartes/credential_<niu>.json` |

## Installation

```bash
# 1) demarrer le backend (dans kyc-vc-project/)
docker compose up -d

# 2) demarrer le front
npm install
cp .env.example .env
npm run dev
```

Le proxy Vite (`vite.config.ts`) redirige vers les 3 services
waltid-identity : `wallet-api` (7001), `issuer-api` (7002),
`verifier-api` (7003).
