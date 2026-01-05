import { useState, useEffect } from 'react';
import { CloseCircle } from "flowbite-react-icons/outline";
import Button from './Button';
import DatePicker from './DatePicker';
import TextInput from './TextInput';
import TitleDropdown from './TitleDropdown';
import DropdownOption from './Dropdown/DropdownOption';
import type { AppointmentModel } from '#domain/models/appointment.ts';
import type { AppointmentStatusTypeModel } from '#domain/typesModel.ts';
import { typeModelToAppointmentStatusTypeDao } from '#domain/typesModel.ts';

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
            <div
                className="w-full max-w-lg rounded-xl bg-surface shadow-xl border border-onSurface/10 p-6 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h2 className="text-title-large text-onSurface font-bold">Editar Cita #{appointment.appointmentNumber}</h2>
                    <button onClick={onClose} className="text-onSurface/50 hover:text-onSurface cursor-pointer transition-colors">
                        <CloseCircle className="w-8 h-8" />
                    </button>
                </div>

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
                            className="min-h-[100px]"
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
            </div>
        </div>
    );
}
