import type { ReactNode } from "react";
import Button from "#components/Button.tsx";
import { CloseCircle, CheckCircle } from "flowbite-react-icons/outline";

interface ConfirmDialogProps {
  open: boolean;
  title?: ReactNode;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function ConfirmDialog({
  open,
  title = "Confirmar",
  message = "¿Estás seguro que desea continuar?",
  confirmLabel = "Aceptar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl bg-surface shadow-xl border border-onSurface/10 p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-label-large text-onSurface">{title}</h2>
          <div className="text-body-medium text-onSurface/80">{message}</div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="resalted"
            className="flex-1"
            onClick={onCancel}
            icon={<CloseCircle />}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="outlined"
            className="flex-1"
            onClick={onConfirm}
            icon={<CheckCircle />}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
