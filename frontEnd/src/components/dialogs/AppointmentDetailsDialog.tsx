import { useState } from "react";
import type { AppointmentModel } from "#domain/models/appointment.ts";
import { Pen, TrashBin } from "flowbite-react-icons/outline";
import Dialog from "#components/dialogs/Dialog.tsx";
import Button from "#components/Button.tsx";
import ConfirmDialog from "#components/dialogs/ConfirmDialog.tsx";
import { CalendarMonth, Clock } from "flowbite-react-icons/solid";

interface AppointmentDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    appointment: AppointmentModel | null;
}

export default function AppointmentDetailsDialog({
    open,
    onClose,
    onEdit,
    onDelete,
    appointment
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

    const programmedDate = appointment.plannedDate.toLocaleDateString("es-ES", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const executionDate = appointment.executionDate?.toLocaleDateString("es-ES", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <Dialog
            open={open}
            title="Detalles de la Cita"
            onClose={onClose}
            headerItems={
                <>
                    <span className={`inline-block px-3 py-1 rounded-full text-label-small ${statusColor}`}>
                        {statusLabel}
                    </span>
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
                        <Clock />
                        <h4 className="text-label-small">
                            Fecha Programada
                        </h4>
                    </header>
                    <p className="text-body-medium ps-7">
                        {programmedDate}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <header className="flex items-center gap-2">
                        <CalendarMonth />
                        <h4 className="text-label-small">
                            Fecha de Ejecución
                        </h4>
                    </header>
                    <p className="text-body-medium ps-7">
                        {executionDate || 'N/A'}
                    </p>
                </div>

                <div className="flex justify-end">
                    {onEdit && (
                        <Button
                            variant="resalted"
                            icon={<Pen />}
                            onClick={onEdit}
                            className="min-w-48 w-1/2"
                            aria-label="Editar Cita">Editar Cita</Button>
                    )}
                </div>
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
