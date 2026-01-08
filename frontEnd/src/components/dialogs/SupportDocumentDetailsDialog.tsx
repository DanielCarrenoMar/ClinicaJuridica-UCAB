import { useState } from "react";
import type { SupportDocumentModel } from "#domain/models/supportDocument.ts";
import Button from "#components/Button.tsx";
import { CalendarMonth, FilePdf, Download, AlignLeft, Pen, TrashBin } from "flowbite-react-icons/outline";
import Dialog from "#components/dialogs/Dialog.tsx";
import ConfirmDialog from "#components/dialogs/ConfirmDialog.tsx";

interface SupportDocumentDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    document: SupportDocumentModel | null;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function SupportDocumentDetailsDialog({
    open,
    onClose,
    document,
    onEdit,
    onDelete
}: SupportDocumentDetailsDialogProps) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    if (!open || !document) return null;

    return (
        <Dialog
            open={open}
            title="Detalles del Recaudo"
            onClose={onClose}
            headerItems={
                onEdit ? (
                    <button
                        onClick={onEdit}
                        className="text-onSurface/50 hover:text-primary cursor-pointer transition-colors p-1"
                    >
                        <Pen className="w-6 h-6" />
                    </button>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-4">
                {/* Header Info */}
                <div className="flex items-center gap-3 p-4 bg-surfaceVariant/30 rounded-lg border border-surfaceVariant">
                    <div className="p-2 bg-surface rounded-md">
                        <FilePdf className="w-6 h-6 text-onSurface" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-title-medium font-bold text-onSurface">{document.title}</h3>
                        <div className="flex gap-2 items-center mt-1">
                            <span className="text-body-small text-onSurface/70">
                                Recaudo #{document.supportNumber}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-onSurface/30"></div>
                            <div className="flex items-center gap-1 text-onSurface/70">
                                <CalendarMonth className="w-3 h-3" />
                                <span className="text-body-small">
                                    {document.submissionDate.toLocaleDateString("es-ES")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                        <AlignLeft className="w-4 h-4" /> Descripción
                    </label>
                    <p className="text-body-medium text-onSurface bg-background p-3 rounded-lg border border-onSurface/5 min-h-20">
                        {document.description || "Sin descripción disponible."}
                    </p>
                </div>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-onSurface/10">
                {onDelete && (
                    <Button
                        variant="outlined"
                        onClick={() => setShowDeleteConfirmation(true)}
                        icon={<TrashBin className="w-4 h-4" />}
                    >
                        Eliminar
                    </Button>
                )}
                <div className={`flex gap-3 ${!onDelete ? 'ml-auto' : ''}`}>
                    <Button
                        variant="outlined"
                        onClick={() => window.open(document.fileUrl, '_blank')}
                        icon={<Download className="w-4 h-4" />}
                    >
                        Descargar
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={showDeleteConfirmation}
                title="Eliminar Recaudo"
                message={`¿Está seguro de que desea eliminar el recaudo "${document.title}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onConfirm={() => {
                    onDelete?.();
                    setShowDeleteConfirmation(false);
                }}
                onCancel={() => setShowDeleteConfirmation(false)}
            />
        </Dialog>
    );
}
