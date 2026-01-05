import type { ReactNode } from "react";
import Button from "#components/Button.tsx";
import { CloseCircle, CheckCircle } from "flowbite-react-icons/outline";
import Dialog from "#components/dialogs/Dialog.tsx";

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
  return (
    <Dialog
      open={open}
      title={title}
      onClose={onCancel ?? (() => { })}
      className="max-w-md"
    >
      <div className="flex flex-col gap-2">
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
          className="flex-1 !bg-error !text-surface"
          onClick={onConfirm}
          icon={<CheckCircle />}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;
