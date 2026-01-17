import { useState } from 'react';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';
import type { AppointmentDAO } from '#database/daos/appointmentDAO.ts';
import type { AppointmentStatusTypeDAO } from '#database/typesDAO.ts';
import DateTimePicker from '#components/DateTimePicker.tsx';

interface AddAppointmentDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (daoAppointment:  Omit<AppointmentDAO, "appointmentNumber" | "idCase" | "userId" | "registryDate">) => void;
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

    const handleSubmit = () => {
        if (!plannedDate && !executionDate) return;

        let status: AppointmentStatusTypeDAO = "P";
        if (executionDate && !plannedDate) {
            status = "R";
        }

        onAdd({
            plannedDate: plannedDate ? plannedDate : executionDate,
            executionDate: executionDate ? executionDate : undefined,
            guidance: guidance || undefined,
            status: status,
        });

        // Reset form
        setPlannedDate("");
        setExecutionDate("");
        setGuidance("");
        onClose();
    };

    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    return (
        <Dialog open={open} title="Nueva Cita" onClose={onClose}>
            <div className="flex flex-col gap-4">
                <DateTimePicker
                    label="Planificada para"
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
                    disabled={!plannedDate && !executionDate}
                >
                    Añadir
                </Button>
            </div>
        </Dialog>
    );
}
