import { useState, useMemo } from 'react';
import { useFindAllAppointments } from '#domain/useCaseHooks/useAppointment.ts';
import { ChevronRight, ChevronLeft } from 'flowbite-react-icons/outline';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import type { AppointmentModel } from '#domain/models/appointment.ts';
import AppointmentDetailsDialog from '#components/dialogs/AppointmentDetailsDialog.tsx';
import DayAppointmentsDialog from '#components/dialogs/DayAppointmentsDialog.tsx';

const DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SAB', 'DOM'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function Calendar() {
    const { appointments, loading } = useFindAllAppointments();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentModel | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Day View State
    const [dayViewDate, setDayViewDate] = useState<Date | null>(null);
    const [isDayViewOpen, setIsDayViewOpen] = useState(false);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Mon, 6=Sun)
    };

    const days = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const prevMonthDays = getDaysInMonth(year, month - 1);

        const calendarDays: { day: number; currentMonth: boolean; key: string; dateObj: Date }[] = [];

        // Previous month padding
        for (let i = 0; i < firstDay; i++) {
            const day = prevMonthDays - firstDay + 1 + i;
            // Key for prev month (handle year wrap)
            const prevDate = new Date(year, month - 1, day);
            calendarDays.push({
                day,
                currentMonth: false,
                key: prevDate.toISOString().split('T')[0],
                dateObj: prevDate
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            // Handle local date string correctly
            const date = new Date(year, month, i);
            // Manually construct YYYY-MM-DD to avoid timezone issues with toISOString
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            calendarDays.push({ day: i, currentMonth: true, key, dateObj: date });
        }

        // Next month padding to fill grid (42 cells likely)
        const remainingCells = 42 - calendarDays.length;
        for (let i = 1; i <= remainingCells; i++) {
            const nextDate = new Date(year, month + 1, i);
            const key = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
            calendarDays.push({ day: i, currentMonth: false, key, dateObj: nextDate });
        }

        return calendarDays;
    }, [currentDate]);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Group appointments by date
    const appointmentsByDate = useMemo(() => {
        const map = new Map<string, AppointmentModel[]>();
        appointments.forEach(appt => {
            // Assuming plannedDate is ISO string or Date object. Normalize to YYYY-MM-DD
            const d = new Date(appt.plannedDate);
            // Use UTC dates to match the "date-only" interpretation of the backend
            const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;

            if (!map.has(key)) map.set(key, []);
            map.get(key)?.push(appt);
        });
        return map;
    }, [appointments]);

    const handleOpenDayView = (date: Date) => {
        setDayViewDate(date);
        setIsDayViewOpen(true);
    };

    if (loading) return <div className="flex h-full items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-200 rounded-full transition-colors border border-gray-300 cursor-pointer">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {MONTHS[currentDate.getMonth()]}, {currentDate.getFullYear()}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-200 rounded-full transition-colors border border-gray-300 cursor-pointer">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </header>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-white">
                {DAYS.map(day => (
                    <div key={day} className="py-4 pl-4 text-xs font-semibold text-gray-400 uppercase border-r border-gray-100 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6 bg-gray-100 gap-px border-b border-gray-100">
                {days.map((dayObj, index) => {
                    const dayAppointments = appointmentsByDate.get(dayObj.key) || [];
                    const isToday = new Date().toISOString().split('T')[0] === dayObj.key;
                    // Limit visible items to 2
                    const visibleAppointments = dayAppointments.slice(0, 1);
                    const hiddenCount = dayAppointments.length - 1;

                    return (
                        <div
                            key={`${dayObj.key}-${index}`}
                            className={`relative bg-white p-2 flex flex-col gap-1 transition-colors h-full w-full overflow-hidden
                                ${!dayObj.currentMonth ? 'bg-gray-50/50 text-gray-400' : 'text-gray-800'}
                                ${dayAppointments.length > 1 ? 'hover:bg-gray-50 cursor-pointer' : ''}
                            `}
                            onClick={() => {
                                if (dayAppointments.length > 1) {
                                    handleOpenDayView(dayObj.dateObj);
                                }
                            }}
                        >
                            <span className={`text-lg font-medium w-8 h-8 flex items-center justify-center rounded-full mb-1 shrink-0
                                ${isToday ? 'bg-black text-white' : ''}
                            `}>
                                {dayObj.day}
                            </span>

                            <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide flex-1">
                                {visibleAppointments.map((apt, i) => {
                                    let colorClass = "bg-surfaceVariant text-onSurfaceVariant"; // Default

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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedAppointment(apt);
                                                setIsDetailsOpen(true);
                                            }}
                                            className={`text-xs px-2 py-1 rounded-md border truncate cursor-pointer transition-colors shrink-0 ${colorClass}`}
                                            title={`${apt.guidance} - ${apt.status}`}
                                        >
                                            {apt.guidance || "Cita"}
                                        </div>
                                    );
                                })}
                                {hiddenCount > 0 && (
                                    <span
                                        className="text-[10px] text-primary font-medium pl-1"
                                    >
                                        + {hiddenCount} más
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AppointmentDetailsDialog
                open={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                appointment={selectedAppointment}
            />

            {dayViewDate && (
                <DayAppointmentsDialog
                    open={isDayViewOpen}
                    onClose={() => setIsDayViewOpen(false)}
                    date={dayViewDate}
                    appointments={
                        appointmentsByDate.get(`${dayViewDate.getFullYear()}-${String(dayViewDate.getMonth() + 1).padStart(2, '0')}-${String(dayViewDate.getDate()).padStart(2, '0')}`) || []
                    }
                    onAppointmentClick={(apt) => {
                        setIsDayViewOpen(false); // Close day view first
                        setSelectedAppointment(apt);
                        setIsDetailsOpen(true);
                    }}
                />
            )}
        </div>
    );
}

export default Calendar;
