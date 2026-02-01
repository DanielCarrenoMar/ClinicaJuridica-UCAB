import { useState } from 'react';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';
import DateTimePicker from '#components/DateTimePicker.tsx';
import type { AppointmentStatusTypeDTO } from '@app/shared/typesDTO';
import type { AppointmentReqDTO } from '@app/shared/dtos/AppoimentDTO';

interface AddAppointmentDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (daoAppointment: Omit<AppointmentReqDTO, "appointmentNumber" | "idCase" | "userId" | "registryDate">) => void;
}

export default function AddAppointmentDialog({
    open,
    onClose,
    onAdd
}: AddAppointmentDialogProps) {
    const [plannedDate, setPlannedDate] = useState("");
    const [executionDate, setExecutionDate] = useState("");
    const [guidance, setGuidance] = useState("");

    if (!open) return null;

    function closeSelf() {
        setPlannedDate("");
        setExecutionDate("");
        setGuidance("");
        onClose();
    }

    const handleSubmit = () => {
        // Prevent submission if both are set or neither is set
        if ((plannedDate.length !== 0 && executionDate.length !== 0) || 
            (plannedDate.length === 0 && executionDate.length === 0)) {
            return;
        }

        let status: AppointmentStatusTypeDTO = "SCHEDULED";
        if (executionDate && !plannedDate) {
            status = "COMPLETED";
        }

        const convertToISO = (datetimeLocal: string): string => {
            if (!datetimeLocal) return "";
            return new Date(datetimeLocal).toISOString();
        };

        const finalDate = plannedDate.length !== 0 ? plannedDate : executionDate;

        onAdd({
            plannedDate: convertToISO(finalDate),
            executionDate: executionDate.length !== 0 ? convertToISO(executionDate) : undefined,
            guidance: guidance || undefined,
            status: status,
        });

        closeSelf()
    };

    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    return (
        <Dialog open={open} title="Nueva Cita" onClose={closeSelf}>
            <div className="flex flex-col gap-4">
                <DateTimePicker
                    label="Planificada para*"
                    value={plannedDate}
                    onChange={setPlannedDate}
                    min={today}
                />

                <DateTimePicker
                    label="Ejecutada el"
                    value={executionDate}
                    onChange={setExecutionDate}
                />

                <div className={`flex flex-col gap-2 ${executionDate === "" ? "opacity-70" : ""}`}>
                    <label className="flex items-center px-1.5 w-full text-label-small text-onSurface">
                        Orientación {executionDate}
                    </label>
                    <TextInput
                        disabled={executionDate === ""}
                        multiline
                        placeholder="Ingrese los detalles de la orientación..."
                        onChangeText={setGuidance}
                        className="min-h-25"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
                <Button
                    variant="resalted"
                    className='min-w-48 w-1/2'
                    onClick={handleSubmit}
                    disabled={plannedDate.length !== 0 && executionDate.length !== 0}
                >
                    Añadir
                </Button>
            </div>
        </Dialog>
    );
}
