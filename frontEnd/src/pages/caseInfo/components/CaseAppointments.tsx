import { useEffect, useMemo, useState } from 'react';
import SearchBar from '#components/SearchBar.tsx';
import Button from '#components/Button.tsx';
import AppointmentCard from '#components/AppointmentCard.tsx';
import AppointmentDetailsDialog from '#components/dialogs/AppointmentDetailsDialog.tsx';
import AddAppointmentDialog from '#components/dialogs/AddAppointmentDialog.tsx';
import EditAppointmentDialog from '#components/dialogs/EditAppointmentDialog.tsx';
import type { AppointmentModel } from '#domain/models/appointment.ts';
import type { AppointmentInfoDAO } from '#database/daos/appointmentInfoDAO.ts';
import type { AppointmentStatusTypeDAO } from '#database/typesDAO.ts';
import type { UserModel } from '#domain/models/user.ts';
import { useGetAppointmentByCaseId } from '#domain/useCaseHooks/useCase.ts';
import { useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from '#domain/useCaseHooks/useAppointment.ts';
import { useNotifications } from '#/context/NotificationsContext';
import Fuse from 'fuse.js';
import { ArrowLeft, ArrowRight } from 'flowbite-react-icons/outline';

interface CaseAppointmentsProps {
    caseId: number;
    applicantName: string;
    user: UserModel | null;
}

export default function CaseAppointments({ caseId, applicantName, user }: CaseAppointmentsProps) {
    const { notyError } = useNotifications();
    const { appointments, loadAppointments } = useGetAppointmentByCaseId(caseId);
    const { createAppointment: createNewAppointment } = useCreateAppointment();
    const { updateAppointment: updateAppt } = useUpdateAppointment();
    const { deleteAppointment: deleteAppt } = useDeleteAppointment();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentModel | null>(null);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
    const [isAddAppointmentDialogOpen, setIsAddAppointmentDialogOpen] = useState(false);
    const [isEditAppointmentDialogOpen, setIsEditAppointmentDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        loadAppointments(caseId, { page, limit: pageSize });
    }, [caseId, loadAppointments, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const appointmentsFuse = useMemo(() => {
        return new Fuse(appointments, {
            keys: [
                { name: 'guidance', weight: 0.55 },
                { name: 'userName', weight: 0.25 },
                { name: 'status', weight: 0.2 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 2,
        });
    }, [appointments]);

    const visibleAppointments = useMemo(() => {
        const trimmed = searchQuery.trim();
        const filtered = trimmed.length === 0
            ? appointments
            : appointmentsFuse.search(trimmed).map(r => r.item);

        const rank = (status: AppointmentModel['status']) => status === 'Programada' ? 0 : 1;

        return filtered
            .map((appointment, index) => ({ appointment, index }))
            .sort((a, b) => rank(a.appointment.status) - rank(b.appointment.status) || a.index - b.index)
            .map(x => x.appointment);
    }, [appointments, appointmentsFuse, searchQuery]);

    const canGoPrev = page > 1;
    const canGoNext = appointments.length === pageSize;

    return (
        <div className="flex flex-col h-full gap-6">
            <section className="flex justify-between items-center gap-4 max-w-5xl">
                <div className='flex-1'>
                    <SearchBar
                        variant='outline'
                        isOpen={true}
                        placeholder="Buscar citas..."
                        onChange={setSearchQuery}
                    />
                </div>
                <Button variant='outlined' onClick={() => setIsAddAppointmentDialogOpen(true)}>
                    Añadir Cita
                </Button>
            </section>

            <section className="flex-1 flex flex-col gap-4 pb-20 overflow-y-auto">
                {visibleAppointments
                    .map(apt => (
                        <AppointmentCard
                            key={apt.appointmentNumber}
                            appointment={apt}
                            applicantName={applicantName}
                            onClick={() => {
                                setSelectedAppointment(apt);
                                setIsAppointmentDialogOpen(true);
                            }}
                        />
                    ))}
            </section>

            <section className="mt-4 flex items-center justify-between max-w-5xl">
                <Button
                    variant="outlined"
                    icon={<ArrowLeft />}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!canGoPrev}
                >
                    Anterior
                </Button>
                <span className="text-body-small text-onSurface/70">Página {page}</span>
                <Button
                    variant="outlined"
                    icon={<ArrowRight />}
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!canGoNext}
                >
                    Siguiente
                </Button>
            </section>

            <AppointmentDetailsDialog
                open={isAppointmentDialogOpen}
                onClose={() => setIsAppointmentDialogOpen(false)}
                appointment={selectedAppointment}
                onEdit={() => {
                    setIsAppointmentDialogOpen(false);
                    setIsEditAppointmentDialogOpen(true);
                }}
                onDelete={async () => {
                    if (!selectedAppointment) return;
                    try {
                        await deleteAppt(selectedAppointment.idCase, selectedAppointment.appointmentNumber);
                        loadAppointments(caseId, { page, limit: pageSize });
                        setIsAppointmentDialogOpen(false);
                        setSelectedAppointment(null);
                    } catch (error: any) {
                        console.error("Error deleting appointment:", error);
                        notyError(error.message || "Error al eliminar la cita");
                    }
                }}
            />

            <AddAppointmentDialog
                open={isAddAppointmentDialogOpen}
                onClose={() => setIsAddAppointmentDialogOpen(false)}
                onAdd={async (data) => {
                    if (!user) return;
                    try {
                        const newAppt: AppointmentInfoDAO = {
                            idCase: caseId,
                            appointmentNumber: 0,
                            plannedDate: data.plannedDate,
                            executionDate: data.executionDate,
                            status: (data.status || "P") as AppointmentStatusTypeDAO,
                            guidance: data.guidance,
                            userId: user.identityCard,
                            userName: user.fullName,
                            registryDate: ""
                        };
                        await createNewAppointment(newAppt);
                        loadAppointments(caseId, { page, limit: pageSize });
                    } catch (error: any) {
                        console.error("Error creating appointment:", error);
                        notyError(error.message || "Error al crear la cita");
                    }
                }}
            />

            <EditAppointmentDialog
                open={isEditAppointmentDialogOpen}
                onClose={() => setIsEditAppointmentDialogOpen(false)}
                appointment={selectedAppointment}
                onSave={async (daoAppointment) => {
                    try {
                        await updateAppt(daoAppointment.idCase, daoAppointment);
                        loadAppointments(daoAppointment.idCase, { page, limit: pageSize });
                        setIsEditAppointmentDialogOpen(false);
                    } catch (error: any) {
                        console.error("Error updating appointment:", error);
                        notyError(error.message || "Error al actualizar la cita");
                    }
                }}
            />
        </div>
    );
}
