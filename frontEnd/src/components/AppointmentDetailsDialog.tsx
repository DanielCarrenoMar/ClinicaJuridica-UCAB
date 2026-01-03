import type { AppointmentModel } from "#domain/models/appointment.ts";
import { CloseCircle, CalendarMonth, User, ClipboardList, Clock } from "flowbite-react-icons/outline";

interface AppointmentDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    appointment: AppointmentModel | null;
    applicantName: string;
}

const TRANSLATED_STATUS: Record<string, string> = {
    "SCHEDULED": "Programada",
    "COMPLETED": "Realizada",
    "CANCELLED": "Cancelada"
};

const STATUS_COLORS: Record<string, string> = {
    "SCHEDULED": "bg-warning text-white",
    "COMPLETED": "bg-success text-white",
    "CANCELLED": "bg-error text-white",
    "Default": "bg-surfaceVariant text-onSurfaceVariant"
};

export default function AppointmentDetailsDialog({
    open,
    onClose,
    appointment,
    applicantName
}: AppointmentDetailsDialogProps) {
    if (!open || !appointment) return null;

    const statusLabel = TRANSLATED_STATUS[appointment.status as string] || appointment.status;
    const statusColor = STATUS_COLORS[appointment.status as string] || STATUS_COLORS.Default;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
            <div
                className="w-full max-w-lg rounded-xl bg-surface shadow-xl border border-onSurface/10 p-6 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h2 className="text-title-large text-onSurface font-bold">Detalles de la Cita</h2>
                    <button onClick={onClose} className="text-onSurface/50 hover:text-onSurface cursor-pointer transition-colors">
                        <CloseCircle className="w-8 h-8" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Header Info */}
                    <div className="flex items-center gap-3 p-3 bg-surfaceVariant/30 rounded-lg border border-surfaceVariant">
                        <div className={`px-3 py-1 rounded-full text-label-medium ${statusColor}`}>
                            {statusLabel}
                        </div>
                        <div className="h-4 w-[1px] bg-onSurface/20"></div>
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
                </div>
            </div>
        </div>
    );
}
