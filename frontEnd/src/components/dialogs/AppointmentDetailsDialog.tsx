import { useState } from "react";
import type { AppointmentModel } from "#domain/models/appointment.ts";
import { CalendarMonth, User, ClipboardList, Clock, Pen, TrashBin } from "flowbite-react-icons/outline";
import Dialog from "#components/dialogs/Dialog.tsx";
import Button from "#components/Button.tsx";
import ConfirmDialog from "#components/dialogs/ConfirmDialog.tsx";

interface AppointmentDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    appointment: AppointmentModel | null;
    applicantName: string;
}




export default function AppointmentDetailsDialog({
    open,
    onClose,
    onEdit,
    onDelete,
    appointment,
    applicantName
}: AppointmentDetailsDialogProps) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    if (!open || !appointment) return null;

    const statusLabel = appointment.status;

    const STATUS_COLORS_MAP: Record<string, string> = {
        "Programada": "bg-warning text-white",
        "Completada": "bg-success text-white",
        "Cancelada": "bg-error text-white",
        "Default": "bg-surfaceVariant text-onSurfaceVariant"
    };

    const statusColor = STATUS_COLORS_MAP[appointment.status as string] || STATUS_COLORS_MAP.Default;

    return (
        <Dialog
            open={open}
            title="Detalles de la Cita"
            onClose={onClose}
            headerItems={
                onEdit ? (
                    <button
                        onClick={onEdit}
                        className="text-primary hover:text-primary/80 cursor-pointer transition-colors"
                        title="Editar cita"
                    >
                        <Pen className="w-6 h-6" />
                    </button>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-4">
                {/* Header Info */}
                <div className="flex items-center gap-3 p-3 bg-surfaceVariant/30 rounded-lg border border-surfaceVariant">
                    <div className={`px-3 py-1 rounded-full text-label-medium ${statusColor}`}>
                        {statusLabel}
                    </div>
                    <div className="h-4 w-px bg-onSurface/20"></div>
                    <span className="text-body-medium text-onSurface">
                        Cita #{appointment.appointmentNumber}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                            <User className="w-4 h-4" /> Solicitante
                        </label>
                        <p className="text-body-large text-onSurface font-medium pl-6">{applicantName}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                            <CalendarMonth className="w-4 h-4" /> Fecha Programada
                        </label>
                        <p className="text-body-large text-onSurface font-medium pl-6">
                            {appointment.plannedDate.toLocaleDateString("es-ES", {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {appointment.executionDate && (
                        <div className="flex flex-col gap-1">
                            <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                                <Clock className="w-4 h-4" /> Fecha de Ejecución
                            </label>
                            <p className="text-body-large text-onSurface font-medium pl-6">
                                {appointment.executionDate.toLocaleDateString("es-ES", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                            <User className="w-4 h-4" /> Responsable (Sistema)
                        </label>
                        <p className="text-body-large text-onSurface font-medium pl-6">{appointment.userName}</p>
                    </div>

                    {appointment.guidance && (
                        <div className="flex flex-col gap-1">
                            <label className="flex items-center gap-2 text-label-medium text-onSurface/70">
                                <ClipboardList className="w-4 h-4" /> Orientación / Notas
                            </label>
                            <p className="text-body-medium text-onSurface pl-6 p-2 bg-background rounded-md border border-onSurface/5">
                                {appointment.guidance}
                            </p>
                        </div>
                    )}
                </div>

                {onDelete && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-onSurface/10 mt-2">
                        <Button
                            variant="outlined"
                            onClick={() => setShowDeleteConfirmation(true)}
                            icon={<TrashBin className="w-4 h-4" />}
                            className="!bg-error !text-surface"
                        >
                            Eliminar Cita
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={showDeleteConfirmation}
                title="Eliminar Cita"
                message={`¿Está seguro de que desea eliminar la cita #${appointment.appointmentNumber}? Esta acción no se puede deshacer.`}
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
