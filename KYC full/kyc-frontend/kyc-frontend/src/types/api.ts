export interface IssuerOnboardResponse {
  issuerDid: string;
  issuerKey: Record<string, unknown>;
}

export interface WalletInfo {
  id: string;
}

export interface DidInfo {
  did: string;
}

export interface VerificationSessionResult {
  verificationResult?: boolean;
  policyResults?: {
    results: Array<{
      credential: string;
      policyResults: Array<{
        result?: { vc?: { credentialSubject?: Record<string, unknown> } };
      }>;
    }>;
  };
  [key: string]: unknown;
}
