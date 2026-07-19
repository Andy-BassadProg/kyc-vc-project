/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_BASE_URL: string;
  readonly VITE_ISSUER_BASE_URL: string;
  readonly VITE_VERIFIER_BASE_URL: string;
  readonly VITE_CREDENTIAL_TYPE: string;
  readonly VITE_CREDENTIAL_CONFIGURATION_ID: string;
  readonly VITE_DEFAULT_AGENT_EMAIL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
