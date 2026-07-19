import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EnrolementForm, { CitoyenDraft } from "./EnrolementForm";
import CaptureBiometrique from "./CaptureBiometrique";
import RecapitulatifEnrolement from "./RecapitulatifEnrolement";
import { genererNiu } from "@/utils/niu";
import { useCredentialIssuance } from "@/hooks/useCredentialIssuance";
import type { Citoyen } from "@/types/citoyen";

type Step = "formulaire" | "biometrie" | "recapitulatif";

// Equiv. AgentTerminal.start_enrollment() (agent_terminal.py) : saisie -> biometrie -> validation -> emission
export default function Enrolement() {
  const [step, setStep] = useState<Step>("formulaire");
  const [citoyen, setCitoyen] = useState<Citoyen | null>(null);
  const { emettre, loading, error } = useCredentialIssuance();
  const navigate = useNavigate();

  async function handleFormSubmit(draft: CitoyenDraft) {
    const niu = await genererNiu(draft.nin, draft.nom, draft.prenom);
    setCitoyen({ ...draft, niu });
    setStep("biometrie");
  }

  function handleBiometrieDone(hashes: { photo_hash: string; empreinte_hash: string }) {
    setCitoyen((c) => (c ? { ...c, ...hashes } : c));
    setStep("recapitulatif");
  }

  async function handleValidation() {
    if (!citoyen) return;
    const credentialId = await emettre(citoyen);
    if (credentialId) navigate(`/registre/${citoyen.niu}`);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Nouvel enrôlement</h2>
      <ol className="flex gap-4 text-sm text-gray-500 mb-6">
        <li className={step === "formulaire" ? "font-semibold text-slate-900" : ""}>1. Données civiles</li>
        <li className={step === "biometrie" ? "font-semibold text-slate-900" : ""}>2. Biométrie</li>
        <li className={step === "recapitulatif" ? "font-semibold text-slate-900" : ""}>3. Validation</li>
      </ol>

      {step === "formulaire" && <EnrolementForm onSubmit={handleFormSubmit} />}
      {step === "biometrie" && citoyen && <CaptureBiometrique onDone={handleBiometrieDone} />}
      {step === "recapitulatif" && citoyen && (
        <RecapitulatifEnrolement
          citoyen={citoyen}
          loading={loading}
          error={error}
          onConfirm={handleValidation}
          onRetour={() => setStep("formulaire")}
        />
      )}
    </div>
  );
}
