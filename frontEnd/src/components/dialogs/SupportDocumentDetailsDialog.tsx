import { useState } from "react";
import type { SupportDocumentModel } from "#domain/models/supportDocument.ts";
import { Pen, TrashBin } from "flowbite-react-icons/outline";
import Dialog from "#components/dialogs/Dialog.tsx";
import Button from "#components/Button.tsx";
import ConfirmDialog from "#components/dialogs/ConfirmDialog.tsx";
import { CalendarMonth, FileSearch } from "flowbite-react-icons/solid";

interface SupportDocumentDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    document: SupportDocumentModel | null;
}

export default function SupportDocumentDetailsDialog({
    open,
    onClose,
    onEdit,
    onDelete,
    document
}: SupportDocumentDetailsDialogProps) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    if (!open || !document) return null;

    const submissionDate = document.submissionDate.toLocaleDateString("es-ES", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });

    return (
        <Dialog
            open={open}
            title="Detalles del Recaudo"
            onClose={onClose}
            headerItems={
                <>
                    {onDelete && (
                        <Button
                            variant="outlined"
                            onClick={() => setShowDeleteConfirmation(true)}
                            icon={<TrashBin />}
                        >
                        </Button>
                    )}
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <header className="flex items-center gap-2">
                        <FileSearch />
                        <h4 className="text-label-small">
                            Título
                        </h4>
                    </header>
                    <p className="text-body-medium ps-7 font-bold">
                        {document.title}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <header className="flex items-center gap-2">
                        <CalendarMonth />
                        <h4 className="text-label-small">
                            Fecha de Entrega
                        </h4>
                    </header>
                    <p className="text-body-medium ps-7 text-capitalize">
                        {submissionDate}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <header className="flex items-center gap-2">
                        <h4 className="text-label-small ps-7">
                            Descripción
                        </h4>
                    </header>
                    <p className="text-body-medium ps-7 text-onSurface/70">
                        {document.description || 'Sin descripción.'}
                    </p>
                </div>

                {document.fileUrl && (
                    <div className="flex flex-col gap-2">
                        <header className="flex items-center gap-2">
                            <h4 className="text-label-small ps-7">
                                Archivo Adjunto
                            </h4>
                        </header>
                        <div className="ps-7 flex flex-col gap-3">
                            <div className="flex items-center gap-2 p-2 px-3 border rounded-lg bg-surface-variant/5 w-fit group hover:bg-surface-variant/10 transition-colors">
                                <FileSearch className="text-primary/70" />
                                <span className="text-body-small font-medium truncate max-w-[150px] md:max-w-[200px]" title={decodeURIComponent(document.fileUrl.split('/').pop() || '')}>
                                    {decodeURIComponent(document.fileUrl.split('/').pop() || 'documento')}
                                </span>
                                <Button
                                    variant="outlined"
                                    onClick={() => window.open(document.fileUrl!, '_blank')}
                                    className="ms-2 scale-90"
                                >
                                    Ver
                                </Button>
                            </div>
                        </div>

                        {/* Image Preview for visual impact */}
                        {document.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                            <div className="mt-2 ps-7 flex justify-center border rounded-xl overflow-hidden bg-surface-variant/10 group cursor-pointer"
                                onClick={() => window.open(document.fileUrl!, '_blank')}>
                                <img
                                    src={document.fileUrl}
                                    alt={document.title}
                                    className="max-h-64 object-contain transition-transform group-hover:scale-[1.02]"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end mt-4">
                    {onEdit && (
                        <Button
                            variant="resalted"
                            icon={<Pen />}
                            onClick={onEdit}
                            className="min-w-48 w-1/2"
                            aria-label="Editar Recaudo">Editar Recaudo</Button>
                    )}
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
