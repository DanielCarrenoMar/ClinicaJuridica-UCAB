import { useState } from 'react';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';

interface AddCaseActionDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (action: { description: string; notes?: string }) => void;
}

export default function AddCaseActionDialog({
    open,
    onClose,
    onAdd
}: AddCaseActionDialogProps) {
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        if (!description.trim()) return;

        onAdd({
            description: description.trim(),
            notes: notes.trim() || undefined
        });

        // Reset form
        setDescription("");
        setNotes("");
        onClose();
    };

    const handleClose = () => {
        const isEmpty = !description.trim() && !notes.trim();
        if (!isEmpty && !window.confirm("¿Cerrar el diálogo? Se perderán los datos no guardados.")) return;

        setDescription("");
        setNotes("");
        onClose();
    };

    return (
        <Dialog
            open={open}
            title="Añadir Acción"
            onClose={handleClose}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="flex items-center px-1.5 w-full text-label-small text-onSurface">
                        Descripción*
                    </label>
                    <TextInput
                        multiline
                        placeholder="Descripción de la acción..."
                        onChangeText={setDescription}
                        value={description}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="flex items-center px-1.5 w-full text-label-small text-onSurface">
                        Notas
                    </label>
                    <TextInput
                        multiline
                        placeholder="Notas adicionales..."
                        onChangeText={setNotes}
                        value={notes}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <Button
                    variant="resalted"
                    className='min-w-48 w-1/2'
                    onClick={handleSubmit}
                    disabled={!description.trim()}
                >
                    Añadir
                </Button>
            </div>
        </Dialog>
    );
}
