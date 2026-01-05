import { useState, useEffect } from 'react';
import type { AppointmentModel } from '#domain/models/appointment.ts';
import type { AppointmentStatusTypeModel } from '#domain/typesModel.ts';
import { typeModelToAppointmentStatusTypeDao } from '#domain/typesModel.ts';
import Button from '#components/Button.tsx';
import DatePicker from '#components/DatePicker.tsx';
import DropdownOption from '#components/Dropdown/DropdownOption.tsx';
import TextInput from '#components/TextInput.tsx';
import TitleDropdown from '#components/TitleDropdown.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';

interface EditAppointmentDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (idCase: number, appointmentNumber: number, data: Partial<AppointmentModel>) => void;
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
    const [status, setStatus] = useState<AppointmentStatusTypeModel | "">("");

    useEffect(() => {
        if (appointment) {
            setPlannedDate(appointment.plannedDate ? new Date(appointment.plannedDate).toISOString().split('T')[0] : "");
            setExecutionDate(appointment.executionDate ? new Date(appointment.executionDate).toISOString().split('T')[0] : "");
            setGuidance(appointment.guidance || "");

            // AppointmentModel.status is AppointmentStatusTypeModel
            setStatus(appointment.status);
        }
    }, [appointment]);

    if (!open || !appointment) return null;

    const handleSubmit = () => {
        if (!plannedDate) return;

        const updateData: Partial<AppointmentModel> = {
            plannedDate: new Date(plannedDate + "T00:00:00"),
            executionDate: executionDate ? new Date(executionDate + "T00:00:00") : undefined,
            guidance: guidance || undefined,
            status: typeModelToAppointmentStatusTypeDao(status as AppointmentStatusTypeModel) as any
        };

        onSave(appointment.idCase, appointment.appointmentNumber, updateData);
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
                    label="Estado"
                    selectedValue={status}
                    onSelectionChange={(val) => setStatus(val as AppointmentStatusTypeModel)}
                >
                    <DropdownOption value="Programada">Programada</DropdownOption>
                    <DropdownOption value="Completada">Completada</DropdownOption>
                    <DropdownOption value="Cancelada">Cancelada</DropdownOption>
                </TitleDropdown>

                <DatePicker
                    label="Fecha Planificada"
                    value={plannedDate}
                    onChange={setPlannedDate}
                    required
                    min={today}
                />

                <DatePicker
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
                    variant="filled"
                    onClick={handleSubmit}
                    disabled={!plannedDate}
                >
                    Guardar Cambios
                </Button>
            </div>
        </Dialog>
    );
}
