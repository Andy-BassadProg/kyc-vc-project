import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { findCitoyen, revoquerCitoyen } from "@/services/api/registreApi";
import { useRegistreStore } from "@/store/registreStore";
import type { RegistreEntry } from "@/types/credential";

// Recherche par NIU/NIN + confirmation de revocation (equiv. revoke_agent.py --niu ...)
export default function Revocation() {
  const [query, setQuery] = useState("");
  const [motif, setMotif] = useState("DEMANDE_ADMINISTRATIVE");
  const [found, setFound] = useState<RegistreEntry | null | undefined>(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const refresh = useRegistreStore((s) => s.refresh);

  function chercher() {
    setFound(findCitoyen(query) ?? null);
  }

  function confirmer() {
    if (!found) return;
    const updated = revoquerCitoyen(found.niu, motif);
    refresh();
    if (updated) setFound(updated);
    setConfirmOpen(false);
  }

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Révocation d'identité</h2>
      <p className="text-sm text-gray-500">Équivalent de <code>revoke_agent.py --niu ...</code>.</p>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Input label="NIU ou NIN" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Button onClick={chercher}>Rechercher</Button>
      </div>

      {found === null && <p className="text-sm text-red-600">Aucun citoyen trouvé.</p>}

      {found && (
        <div className="border rounded-lg p-4 bg-white flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">{found.prenom} {found.nom}</p>
            <Badge statut={found.statut} />
          </div>
          <p className="text-xs text-gray-500">NIU : {found.niu} — NIN : {found.nin}</p>

          {found.statut === "ACTIF" ? (
            <>
              <Input label="Motif" value={motif} onChange={(e) => setMotif(e.target.value)} />
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>Révoquer ce credential</Button>
            </>
          ) : (
            <p className="text-xs text-gray-500">
              Révoqué le {found.date_revocation ? new Date(found.date_revocation).toLocaleString() : "?"}
              {found.motif ? ` — motif : ${found.motif}` : ""}
            </p>
          )}
        </div>
      )}

      <Modal
        open={confirmOpen}
        title="Confirmer la révocation"
        onConfirm={confirmer}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel="Révoquer"
        danger
      >
        Cette action est irréversible et ajoutera le credential à la liste de révocation.
      </Modal>
    </div>
  );
}
