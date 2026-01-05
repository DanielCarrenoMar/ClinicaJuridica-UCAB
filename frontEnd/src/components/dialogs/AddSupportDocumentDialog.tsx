import { useState } from 'react';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';

interface AddSupportDocumentDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (document: { title: string; description: string; submissionDate: Date; fileUrl?: string }) => void;
}

export default function AddSupportDocumentDialog({
    open,
    onClose,
    onAdd
}: AddSupportDocumentDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        if (!title || !description) return;

        onAdd({
            title,
            description,
            submissionDate: new Date(),
            fileUrl: fileUrl || undefined
        });

        // Reset form
        setTitle("");
        setDescription("");
        setFileUrl("");
        onClose();
    };

    return (
        <Dialog open={open} title="Nuevo Recaudo" onClose={onClose}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="flex items-center px-1.5 w-full text-body-large text-onSurface">
                        Título
                    </label>
                    <TextInput
                        placeholder="Ingrese el título del recaudo..."
                        onChangeText={setTitle}
                        value={title}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="flex items-center px-1.5 w-full text-body-large text-onSurface">
                        Descripción
                    </label>
                    <TextInput
                        multiline
                        placeholder="Ingrese la descripción..."
                        onChangeText={setDescription}
                        value={description}
                        className="min-h-25"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
                <Button
                    variant="filled"
                    onClick={handleSubmit}
                    disabled={!title || !description}
                >
                    Añadir
                </Button>
            </div>
        </Dialog>
    );
}
