import { useState } from 'react';
import { CloseCircle, CalendarMonth, ClipboardList, Clock } from "flowbite-react-icons/outline";
import Button from './Button';
import DatePicker from './DatePicker';
import TextInput from './TextInput';

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

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
            <div
                className="w-full max-w-lg rounded-xl bg-surface shadow-xl border border-onSurface/10 p-6 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h2 className="text-title-large text-onSurface font-bold">Nueva Cita</h2>
                    <button onClick={onClose} className="text-onSurface/50 hover:text-onSurface cursor-pointer transition-colors">
                        <CloseCircle className="w-8 h-8" />
                    </button>
                </div>

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
                        min={today}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="flex items-center px-1.5 w-full text-body-large text-onSurface">
                            Orientación
                        </label>
                        <TextInput
                            multiline
                            placeholder="Ingrese los detalles de la orientación..."
                            onChangeText={setGuidance}
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
                        Añadir
                    </Button>
                </div>
            </div>
        </div>
    );
}
