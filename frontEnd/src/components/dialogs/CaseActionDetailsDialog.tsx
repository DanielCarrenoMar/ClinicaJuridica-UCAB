import type { CaseActionModel } from "#domain/models/caseAction.ts";
import { User, CalendarMonth, ClipboardList, AlignLeft } from "flowbite-react-icons/outline";
import Dialog from "#components/dialogs/Dialog.tsx";

interface CaseActionDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    caseAction: CaseActionModel | null;
}

export default function CaseActionDetailsDialog({
    open,
    onClose,
    caseAction
}: CaseActionDetailsDialogProps) {
    if (!open || !caseAction) return null;

    return (
        <Dialog
            open={open}
            title="Detalles de la Acción"
            onClose={onClose}
        >
            <div className="flex flex-col gap-4">
                {/* Header Info */}
                <div className="flex items-center gap-3 p-3 bg-surfaceVariant/30 rounded-lg border border-surfaceVariant">
                    <div className="p-2 bg-surface rounded-md">
                        <ClipboardList className="w-6 h-6 text-onSurface" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-title-medium font-bold text-onSurface">Acción #{caseAction.actionNumber}</h3>
                        <p className="text-body-small text-onSurface/70">
                            Caso: {caseAction.idCase}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                            <User className="w-4 h-4" /> Usuario Responsable
                        </label>
                        <p className="text-body-large text-onSurface font-medium pl-6">{caseAction.userName}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                            <CalendarMonth className="w-4 h-4" /> Fecha de Registro
                        </label>
                        <p className="text-body-large text-onSurface font-medium pl-6">
                            {caseAction.registryDate.toLocaleDateString("es-ES", {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                            <ClipboardList className="w-4 h-4" /> Descripción
                        </label>
                        <p className="text-body-medium text-onSurface pl-6 p-2 bg-background rounded-md border border-onSurface/5">
                            {caseAction.description}
                        </p>
                    </div>

                    {caseAction.notes && (
                        <div className="flex flex-col gap-1">
                            <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                                <AlignLeft className="w-4 h-4" /> Notas Adicionales
                            </label>
                            <p className="text-body-medium text-onSurface pl-6 p-2 bg-background rounded-md border border-onSurface/5">
                                {caseAction.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
}
