import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as walletApi from "@/services/api/walletApi";
import { useAuthStore } from "@/store/authStore";

// Equiv. ensure_login() de kyc_pipeline.py
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      await walletApi.registerDemoAccount(email, password);
      await walletApi.login(email, password);
      const wallets = await walletApi.getWallets();
      if (!wallets.length) throw new Error("Aucun wallet trouvé");
      const walletId = wallets[0].id;
      const dids = await walletApi.getDids(walletId);
      if (!dids.length) throw new Error("Aucun DID trouvé");
      const did = dids[0].did;
      setSession({ walletId, did, agentEmail: email });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        "Connexion impossible. Vérifiez que les services waltid-identity tournent (wallet sur le port 7001)."
      );
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}
