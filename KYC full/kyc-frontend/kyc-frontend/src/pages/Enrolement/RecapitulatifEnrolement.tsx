import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import type { Citoyen } from "@/types/citoyen";

// Ecran de validation agent avant emission (equiv. confirmation O/N du CLI)
export default function RecapitulatifEnrolement({
  citoyen, loading, error, onConfirm, onRetour,
}: {
  citoyen: Citoyen;
  loading: boolean;
  error: string | null;
  onConfirm: () => void;
  onRetour: () => void;
}) {
  return (
    <div className="max-w-md flex flex-col gap-4">
      <div className="border rounded-lg p-4 bg-white flex flex-col gap-1 text-sm">
        <p><span className="text-gray-500">Nom :</span> {citoyen.nom} {citoyen.prenom}</p>
        <p><span className="text-gray-500">NIN :</span> {citoyen.nin}</p>
        <p><span className="text-gray-500">NIU généré :</span> <span className="font-mono">{citoyen.niu}</span></p>
        <p><span className="text-gray-500">Date de naissance :</span> {citoyen.date_naissance}</p>
        <p><span className="text-gray-500">Nationalité :</span> {citoyen.nationalite}</p>
      </div>
      {error && <Toast type="error" message={error} />}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onRetour} disabled={loading}>Retour</Button>
        <Button onClick={onConfirm} disabled={loading}>
          {loading ? "Émission en cours..." : "Valider et émettre le credential"}
        </Button>
      </div>
    </div>
  );
}
