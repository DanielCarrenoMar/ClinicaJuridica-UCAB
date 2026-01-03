import type { SupportDocumentModel } from "#domain/models/supportDocument.ts";
import Button from "#components/Button.tsx";
import { CloseCircle, CalendarMonth, FilePdf, Download, AlignLeft } from "flowbite-react-icons/outline";

interface SupportDocumentDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    document: SupportDocumentModel | null;
}

export default function SupportDocumentDetailsDialog({
    open,
    onClose,
    document
}: SupportDocumentDetailsDialogProps) {
    if (!open || !document) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
            <div
                className="w-full max-w-lg rounded-xl bg-surface shadow-xl border border-onSurface/10 p-6 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h2 className="text-title-large text-onSurface font-bold">Detalles del Recaudo</h2>
                    <button onClick={onClose} className="text-onSurface/50 hover:text-onSurface cursor-pointer transition-colors">
                        <CloseCircle className="w-8 h-8" />
                    </button>
                </div>

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
                        <p className="text-body-medium text-onSurface bg-background p-3 rounded-lg border border-onSurface/5 min-h-[80px]">
                            {document.description || "Sin descripción disponible."}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-onSurface/10">
                    <Button
                        variant="filled"
                        onClick={() => window.open(document.fileUrl, '_blank')}
                        icon={<Download className="w-4 h-4" />}
                    >
                        Descargar
                    </Button>
                </div>
            </div>
        </div>
    );
}
