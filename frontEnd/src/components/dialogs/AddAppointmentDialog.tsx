import { useState } from 'react';
import Button from '#components/Button.tsx';
import DatePicker from '#components/DatePicker.tsx';
import TextInput from '#components/TextInput.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';

interface AddAppointmentDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (appointment: { plannedDate: Date; executionDate?: Date; guidance?: string }) => void;
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
        if (!plannedDate) return;

        onAdd({
            plannedDate: new Date(plannedDate + "T00:00:00"),
            executionDate: executionDate ? new Date(executionDate + "T00:00:00") : undefined,
            guidance: guidance || undefined
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
                <DatePicker
                    label="Fecha Planificada"
                    value={plannedDate}
                    onChange={setPlannedDate}
                    min={today}
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
                    Añadir
                </Button>
            </div>
        </Dialog>
    );
}
