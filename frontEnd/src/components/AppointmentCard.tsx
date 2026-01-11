import type { AppointmentModel } from '#domain/models/appointment.ts';
import { Link } from 'react-router';

interface AppointmentCardProps {
    appointment: AppointmentModel;
    applicantName: string;
    onClick: () => void;
}

export default function AppointmentCard({ appointment, applicantName, onClick }: AppointmentCardProps) {
    const dateLabel = appointment.status === "Completada" ? "Realizada el" :
        appointment.status === "Cancelada" ? "Cancelada el" : "Programada para el";

    const dateString = appointment.plannedDate.toLocaleDateString("es-ES", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });

    return (
        <div
            onClick={onClick}
            className={`group w-full py-2.5 px-4 rounded-3xl bg-surface/70 hover:bg-surface border border-onSurface/30 hover:border-onSurface/40 transition-all cursor-pointer flex flex-col gap-2 ${appointment.status !== 'Programada' && 'opacity-90 h-24'}`}
        >
            <header className="flex justify-between items-center w-full">
                <span className="flex items-center text-body-medium">
                    Creada por&nbsp;
                    <Link to="#" className="text-body-large hover:underline" onClick={(e) => e.stopPropagation()}>{applicantName}</Link>
                </span>
                <div className="text-body-medium">
                    <strong className='text-body-large'>{dateLabel}</strong> {dateString}
                </div>
            </header>

            {appointment.guidance && <p className="pl-6 text-body-medium text-onSurface/70 line-clamp-2">
                {appointment.guidance}
            </p>}
        </div>
    );
}
