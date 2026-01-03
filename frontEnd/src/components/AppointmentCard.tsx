import { User } from 'flowbite-react-icons/solid';
import type { AppointmentModel } from '#domain/models/appointment.ts';

interface AppointmentCardProps {
    appointment: AppointmentModel;
    applicantName: string;
    onClick: () => void;
}

export default function AppointmentCard({ appointment, applicantName, onClick }: AppointmentCardProps) {

    // Determine the date to show based on status
    const dateLabel = appointment.status === "COMPLETED" ? "Realizada el" :
        appointment.status === "CANCELLED" ? "Cancelada el" : "Programada para el";

    const dateString = appointment.plannedDate.toLocaleDateString("es-ES", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <div
            onClick={onClick}
            className="group w-full p-4 rounded-xl bg-surface border border-onSurface/10 hover:border-onSurface/30 hover:shadow-sm transition-all cursor-pointer flex flex-col gap-2"
        >
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-surfaceVariant/50 text-onSurface">
                        <User className="w-6 h-6" />
                    </div>
                    <span className="text-title-medium text-onSurface font-bold">{applicantName}</span>
                </div>
                <div className="text-body-medium text-onSurfaceVariant">
                    {dateLabel} <span className="text-onSurface font-medium">{dateString}</span>
                </div>
            </div>

            <div className="pl-[52px]">
                <p className="text-body-medium text-onSurface/80 line-clamp-2">
                    {appointment.guidance || "Sin descripción disponible."}
                </p>
            </div>
        </div>
    );
}
