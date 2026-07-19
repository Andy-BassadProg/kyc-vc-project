import { create } from "zustand";
import type { RegistreEntry } from "@/types/credential";
import { listCitoyens } from "@/services/api/registreApi";

interface RegistreState {
  citoyens: RegistreEntry[];
  refresh: () => void;
}

// Miroir reactif du registre local (voir services/api/registreApi.ts)
export const useRegistreStore = create<RegistreState>((set) => ({
  citoyens: listCitoyens(),
  refresh: () => set({ citoyens: listCitoyens() }),
}));
