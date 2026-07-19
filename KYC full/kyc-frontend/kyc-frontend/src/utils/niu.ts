import { sha256Hex } from "./crypto";

// Port de AgentTerminal._generer_niu (agent_terminal.py) : hash tronque a 16 caracteres, majuscules
export async function genererNiu(nin: string, nom: string, prenom: string): Promise<string> {
  const raw = `${nin}${nom}${prenom}${new Date().toISOString()}`;
  const hash = await sha256Hex(raw);
  return hash.slice(0, 16).toUpperCase();
}
