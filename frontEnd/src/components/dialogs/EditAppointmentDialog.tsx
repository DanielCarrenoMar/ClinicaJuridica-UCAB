import { useState, useEffect } from 'react';
import type { AppointmentModel } from '#domain/models/appointment.ts';
import type { AppointmentStatusTypeModel } from '#domain/typesModel.ts';
import { typeModelToAppointmentStatusTypeDto } from '#domain/typesModel.ts';
import Button from '#components/Button.tsx';
import DropdownOption from '#components/Dropdown/DropdownOption.tsx';
import TextInput from '#components/TextInput.tsx';
import TitleDropdown from '#components/TitleDropdown.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';
import type { AppointmentDAO } from '#database/daos/appointmentDAO.ts';
import DateTimePicker from '#components/DateTimePicker.tsx';

interface EditAppointmentDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (daoAppointment: AppointmentDAO) => void;
    appointment: AppointmentModel | null;
}

export default function EditAppointmentDialog({
    open,
    onClose,
    onSave,
    appointment
}: EditAppointmentDialogProps) {
    const [plannedDate, setPlannedDate] = useState("");
    const [executionDate, setExecutionDate] = useState("");
    const [guidance, setGuidance] = useState("");
    // Initialize with a valid default or empty string if that's how you handle "loading" state, 
    // but better to use the specific type or undefined. 
    // Since Dropdown expects string, we keep it as string but cast when saving.
    const [status, setStatus] = useState<AppointmentStatusTypeModel>();

    useEffect(() => {
        if (appointment) {
            // Convertir Date a formato datetime-local (YYYY-MM-DDTHH:mm)
            const formatDateTimeLocal = (date: Date): string => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            };

            setPlannedDate(appointment.plannedDate ? formatDateTimeLocal(new Date(appointment.plannedDate)) : "");
            setExecutionDate(appointment.executionDate ? formatDateTimeLocal(new Date(appointment.executionDate)) : "");
            setGuidance(appointment.guidance || "");

            // AppointmentModel.status is AppointmentStatusTypeModel
            setStatus(appointment.status);
        }
    }, [appointment]);

    if (!open || !appointment) return null;

    const handleSubmit = () => {
        if (!plannedDate) return;

        // Convertir datetime-local a formato ISO para el backend
        const convertToISO = (datetimeLocal: string): string => {
            if (!datetimeLocal) return "";
            // datetime-local viene como "YYYY-MM-DDTHH:mm", necesitamos agregar segundos y timezone
            return new Date(datetimeLocal).toISOString();
        };

        const updateData: AppointmentDAO = {
            idCase: appointment.idCase,
            appointmentNumber: appointment.appointmentNumber,
            userId: appointment.userId,
            registryDate: appointment.registryDate.toISOString(),
            plannedDate: convertToISO(plannedDate),
            executionDate: executionDate ? convertToISO(executionDate) : undefined,
            guidance: guidance || undefined,
            status: typeModelToAppointmentStatusTypeDto(status as AppointmentStatusTypeModel) as any
        };

        onSave(updateData);
        onClose();
    };

    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    return (
        <Dialog
            open={open}
            title={`Editar Cita #${appointment.appointmentNumber}`}
            onClose={onClose}
        >
            <div className="flex flex-col gap-4">
                <TitleDropdown
                    label="Estado*"
                    selectedValue={status}
                    onSelectionChange={(val) => setStatus(val as AppointmentStatusTypeModel)}
                >
                    <DropdownOption value="Programada">Programada</DropdownOption>
                    <DropdownOption value="Completada">Completada</DropdownOption>
                    <DropdownOption value="Cancelada">Cancelada</DropdownOption>
                </TitleDropdown>

                <DateTimePicker
                    label="Fecha Planificada*"
                    value={plannedDate}
                    onChange={setPlannedDate}
                    required
                    min={today}
                />

                <DateTimePicker
                    label="Fecha de Ejecución"
                    value={executionDate}
                    onChange={setExecutionDate}
                />

                <div className="flex flex-col gap-2">
                    <label className="flex items-center px-1.5 w-full text-body-large text-onSurface">
                        Orientación
                    </label>
                    <TextInput
                        multiline
                        placeholder="Ingrese los detalles de la orientación..."
                        onChangeText={setGuidance}
                        value={guidance}
                        className="min-h-25"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
                <Button
                    variant="resalted"
                    className='min-w-48 w-1/2'
                    onClick={handleSubmit}
                    disabled={!plannedDate}
                >
                    Guardar Cambios
                </Button>
            </div>
        </Dialog>
    );
}
