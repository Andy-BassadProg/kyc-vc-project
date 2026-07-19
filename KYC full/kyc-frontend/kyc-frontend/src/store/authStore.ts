import { create } from "zustand";

interface AuthState {
  walletId: string | null;
  did: string | null;
  agentEmail: string | null;
  isAuthenticated: boolean;
  setSession: (session: { walletId: string; did: string; agentEmail: string }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  walletId: null,
  did: null,
  agentEmail: null,
  isAuthenticated: false,
  setSession: ({ walletId, did, agentEmail }) =>
    set({ walletId, did, agentEmail, isAuthenticated: true }),
  clearSession: () => set({ walletId: null, did: null, agentEmail: null, isAuthenticated: false }),
}));
