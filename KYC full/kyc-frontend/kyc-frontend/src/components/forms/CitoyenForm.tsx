import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Citoyen } from "@/types/citoyen";

export type CitoyenDraft = Omit<Citoyen, "niu" | "photo_hash" | "empreinte_hash">;

const EMPTY: CitoyenDraft = {
  prenom: "", nom: "", nin: "", date_naissance: "", lieu_naissance: "",
  nationalite: "", genre: "M", pere: "", mere: "", profession: "",
  adresse: "", document: "", num_document: "",
};

// Champs equiv. a agent_terminal.py._saisir_donnees()
export default function CitoyenForm({
  onSubmit, submitLabel = "Continuer",
}: { onSubmit: (data: CitoyenDraft) => void; submitLabel?: string }) {
  const [data, setData] = useState<CitoyenDraft>(EMPTY);

  function set<K extends keyof CitoyenDraft>(key: K, value: CitoyenDraft[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  return (
    <form
      className="grid grid-cols-2 gap-4 max-w-2xl"
      onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}
    >
      <Input label="Prénom" required value={data.prenom} onChange={(e) => set("prenom", e.target.value)} />
      <Input label="Nom" required value={data.nom} onChange={(e) => set("nom", e.target.value)} />
      <Input label="NIN" required value={data.nin} onChange={(e) => set("nin", e.target.value)} />
      <Input
        label="Date de naissance (JJ/MM/AAAA)" required placeholder="01/01/1990"
        value={data.date_naissance} onChange={(e) => set("date_naissance", e.target.value)}
      />
      <Input label="Lieu de naissance" required value={data.lieu_naissance} onChange={(e) => set("lieu_naissance", e.target.value)} />
      <Input label="Nationalité" required value={data.nationalite} onChange={(e) => set("nationalite", e.target.value)} />
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600">Genre</span>
        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          value={data.genre}
          onChange={(e) => set("genre", e.target.value as "M" | "F")}
        >
          <option value="M">M</option>
          <option value="F">F</option>
        </select>
      </label>
      <Input label="Profession" value={data.profession} onChange={(e) => set("profession", e.target.value)} />
      <Input label="Père" value={data.pere} onChange={(e) => set("pere", e.target.value)} />
      <Input label="Mère" value={data.mere} onChange={(e) => set("mere", e.target.value)} />
      <Input
        label="Adresse" value={data.adresse} onChange={(e) => set("adresse", e.target.value)}
        className="col-span-2"
      />
      <Input label="Document présenté" value={data.document} onChange={(e) => set("document", e.target.value)} />
      <Input label="N° document" value={data.num_document} onChange={(e) => set("num_document", e.target.value)} />
      <div className="col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
