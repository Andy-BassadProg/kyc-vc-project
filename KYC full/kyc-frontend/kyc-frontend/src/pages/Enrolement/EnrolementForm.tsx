import CitoyenForm, { CitoyenDraft } from "@/components/forms/CitoyenForm";

export type { CitoyenDraft };

export default function EnrolementForm({ onSubmit }: { onSubmit: (data: CitoyenDraft) => void }) {
  return <CitoyenForm onSubmit={onSubmit} submitLabel="Continuer vers la biométrie" />;
}
