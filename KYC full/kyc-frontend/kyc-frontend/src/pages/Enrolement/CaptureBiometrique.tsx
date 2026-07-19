import { useState } from "react";
import Button from "@/components/ui/Button";
import { sha256Hex } from "@/utils/crypto";

// Etape capture photo/empreinte (equiv. photo_hash / empreinte_hash dans agent_terminal.py)
export default function CaptureBiometrique({
  onDone,
}: { onDone: (hashes: { photo_hash: string; empreinte_hash: string }) => void }) {
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(false);

  async function capturer() {
    setLoading(true);
    const photo_hash = await sha256Hex(`PHOTO_${new Date().toISOString()}`);
    const empreinte_hash = await sha256Hex(`EMPREINTE_${new Date().toISOString()}`);
    setCaptured(true);
    setLoading(false);
    onDone({ photo_hash, empreinte_hash });
  }

  return (
    <div className="max-w-md flex flex-col gap-4">
      <p className="text-sm text-gray-600">
        Positionnez le citoyen face à la caméra, puis lancez la capture photo et empreinte.
      </p>
      <div className="border rounded-lg h-48 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
        {captured ? "Capture enregistrée" : "Aperçu caméra"}
      </div>
      <Button onClick={capturer} disabled={loading}>
        {loading ? "Capture en cours..." : "Lancer la capture"}
      </Button>
    </div>
  );
}
