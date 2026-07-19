const styles: Record<string, string> = {
  ACTIF: "bg-green-100 text-green-700",
  REVOQUE: "bg-red-100 text-red-700",
  EN_ATTENTE: "bg-amber-100 text-amber-700",
};

export default function Badge({ statut }: { statut: string }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[statut] || "bg-gray-100 text-gray-700"}`}>
      {statut}
    </span>
  );
}
