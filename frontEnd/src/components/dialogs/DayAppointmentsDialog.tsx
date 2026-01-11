import Dialog from "#components/dialogs/Dialog.tsx";
import type { AppointmentModel } from "#domain/models/appointment.ts";

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

                        return (
                            <div
                                key={i}
                                onClick={() => onAppointmentClick(apt)}
                                className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
                            >
                                <span className="font-medium text-body-medium truncate flex-1 pr-2">
                                    {apt.guidance || "Cita sin descripción"}
                                </span>
                                <span className="text-label-small opacity-90 whitespace-nowrap">
                                    {apt.status}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </Dialog>
    );
}
