import { useState } from 'react';
import TitleTextInput from '../TitleTextInput.tsx';
import DatePicker from '../DatePicker.tsx';
import Button from '../Button.tsx';
import Dialog from './Dialog.tsx';
import type { SemesterDAO } from '#database/daos/semesterDAO.ts';

type Props = {
    open: boolean;
    onClose: () => void;
    onAdd: (data: SemesterDAO) => Promise<void>;
};

export default function AddSemesterDialog({ open, onClose, onAdd }: Props) {
    const [term, setTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!term || !startDate || !endDate) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        setLoading(true);
        try {
            await onAdd({
                term,
                startDate,
                endDate
            });
            handleClose();
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTerm('');
        setStartDate('');
        setEndDate('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} title="Añadir Semestre">
            <div className="flex flex-col gap-4">
                <TitleTextInput
                    label="Término"
                    placeholder="Ej. 2025 - 2026"
                    value={term}
                    onChange={setTerm}
                />
                <DatePicker
                    label="Fecha de Inicio"
                    value={startDate}
                    onChange={setStartDate}
                />
                <DatePicker
                    label="Fecha de Fin"
                    value={endDate}
                    onChange={setEndDate}
                />
                <div className="flex justify-end w-full mt-4">
                    <Button
                        variant="resalted"
                        onClick={handleSubmit}
                        disabled={loading || !term || !startDate || !endDate}
                        className="min-w-48 w-1/2"
                    >
                        Añadir Semestre
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
