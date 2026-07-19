import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import Button from "@/components/ui/Button";

export default function Header() {
  const { agentEmail, did, clearSession } = useAuthStore();
  const online = useOfflineStatus();
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <div className="text-sm text-gray-500">
        Agent : <span className="text-gray-800">{agentEmail || "—"}</span>
        {did && <span className="ml-2 text-xs text-gray-400">DID {did.slice(0, 24)}…</span>}
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-1 rounded ${online ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {online ? "En ligne" : "Hors ligne"}
        </span>
        <Button
          variant="secondary"
          onClick={() => { clearSession(); navigate("/login"); }}
        >
          Déconnexion
        </Button>
      </div>
    </header>
  );
}
