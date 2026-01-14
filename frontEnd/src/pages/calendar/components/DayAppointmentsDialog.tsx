import Dialog from "#components/dialogs/Dialog.tsx";
import type { AppointmentModel } from "#domain/models/appointment.ts";
import { Clock } from "flowbite-react-icons/solid";

interface DayAppointmentsDialogProps {
    open: boolean;
    onClose: () => void;
    date: Date;
    appointments: AppointmentModel[];
    onAppointmentClick: (appointment: AppointmentModel) => void;
}

export default function DayAppointmentsDialog({
    open,
    onClose,
    date,
    appointments,
    onAppointmentClick
}: DayAppointmentsDialogProps) {
    if (!open) return null;

    const formattedDate = date.toLocaleDateString("es-ES", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });

    return (
        <Dialog
            open={open}
            title={`Citas del ${formattedDate}`}
            onClose={onClose}
        >
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                {appointments.length === 0 ? (
                    <p className="text-body-medium text-onSurface/60 text-center py-4">No hay citas para este día.</p>
                ) : (
                    appointments.map((apt, i) => {
                        let colorClass = "bg-surfaceVariant text-onSurfaceVariant border-onSurfaceVariant/20"; // Default

                        if (apt.status === "Programada") {
                            colorClass = "bg-warning text-white";
                        } else if (apt.status === "Completada") {
                            colorClass = "bg-success text-white";
                        } else if (apt.status === "Cancelada") {
                            colorClass = "bg-error text-white";
                        }
                        
                        // Format time (assuming plannedDate holds the full datetime)
                        const timeString = apt.plannedDate.toLocaleTimeString("es-ES", {
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div
                                key={i}
                                onClick={() => onAppointmentClick(apt)}
                                className={`p-3 rounded-xl border flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-body-medium truncate pr-2">
                                        {apt.guidance || "Cita sin descripción"}
                                    </span>
                                    <span className="text-label-small opacity-90 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/10 backdrop-blur-sm">
                                        {apt.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-label-medium opacity-90">
                                    <Clock className="w-4 h-4" />
                                    <span>{timeString}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Dialog>
    );
}

