import { walletClient } from "./client";
import type { WalletInfo, DidInfo } from "@/types/api";

// POST /wallet-api/auth/register — equiv. ensure_demo_account()
export async function registerDemoAccount(email: string, password: string): Promise<void> {
  try {
    await walletClient.post("/wallet-api/auth/register", {
      type: "email",
      name: "demo",
      email,
      password,
    });
  } catch {
    // compte deja existant : tolerant, comme le script Python
  }
}

// POST /wallet-api/auth/login
export async function login(email: string, password: string): Promise<{ token?: string }> {
  const { data } = await walletClient.post("/wallet-api/auth/login", {
    type: "email",
    email,
    password,
  });
  return data;
}

// GET /wallet-api/wallet/accounts/wallets
export async function getWallets(): Promise<WalletInfo[]> {
  const { data } = await walletClient.get("/wallet-api/wallet/accounts/wallets");
  return data.wallets ?? [];
}

// GET /wallet-api/wallet/{walletId}/dids
export async function getDids(walletId: string): Promise<DidInfo[]> {
  const { data } = await walletClient.get(`/wallet-api/wallet/${walletId}/dids`);
  return data ?? [];
}

// GET /wallet-api/wallet/{walletId}/credentials
export async function getCredentials(walletId: string): Promise<Array<{ id: string; document: string }>> {
  const { data } = await walletClient.get(`/wallet-api/wallet/${walletId}/credentials`);
  return data ?? [];
}

// POST /wallet-api/wallet/{walletId}/exchange/useOfferRequest — reception d'un credential emis
export async function useOfferRequest(walletId: string, did: string, offer: string): Promise<Array<{ id: string }>> {
  const { data } = await walletClient.post(
    `/wallet-api/wallet/${walletId}/exchange/useOfferRequest?did=${encodeURIComponent(did)}`,
    offer,
    { headers: { "Content-Type": "text/plain" } }
  );
  return data ?? [];
}

// POST /wallet-api/wallet/{walletId}/exchange/usePresentationRequest — presentation pour verification
export async function usePresentationRequest(
  walletId: string,
  did: string,
  presentationRequest: string,
  selectedCredentials: string[]
): Promise<unknown> {
  const { data } = await walletClient.post(
    `/wallet-api/wallet/${walletId}/exchange/usePresentationRequest?did=${encodeURIComponent(did)}`,
    { presentationRequest, selectedCredentials }
  );
  return data;
}
