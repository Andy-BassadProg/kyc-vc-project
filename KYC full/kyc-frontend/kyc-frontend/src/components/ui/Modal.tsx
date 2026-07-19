import { ReactNode } from "react";
import Button from "./Button";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}

// Utilise pour les confirmations (equiv. de l'invite "Confirmer ? (O/N)" du CLI)
export default function Modal({
  open, title, children, onConfirm, onCancel, confirmLabel = "Confirmer", danger,
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="text-sm text-gray-600 mb-6">{children}</div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>Annuler</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
