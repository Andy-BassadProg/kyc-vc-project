import { useMemo, useState } from "react";
import { useRegistreStore } from "@/store/registreStore";

// Liste + recherche sur le registre local (equiv. parcours de state/registre_national.json)
export function useCitoyens() {
  const { citoyens, refresh } = useRegistreStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return citoyens;
    const q = query.trim().toLowerCase();
    return citoyens.filter(
      (c) =>
        c.niu.toLowerCase().includes(q) ||
        c.nin.toLowerCase().includes(q) ||
        c.nom.toLowerCase().includes(q) ||
        c.prenom.toLowerCase().includes(q)
    );
  }, [citoyens, query]);

  return { citoyens: filtered, all: citoyens, query, setQuery, refresh };
}
