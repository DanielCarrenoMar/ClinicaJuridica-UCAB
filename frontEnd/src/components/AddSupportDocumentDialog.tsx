import { useState } from 'react';
import { CloseCircle } from "flowbite-react-icons/outline";
import Button from './Button';
import TextInput from './TextInput';

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

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
            <div
                className="w-full max-w-lg rounded-xl bg-surface shadow-xl border border-onSurface/10 p-6 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h2 className="text-title-large text-onSurface font-bold">Nuevo Recaudo</h2>
                    <button onClick={onClose} className="text-onSurface/50 hover:text-onSurface cursor-pointer transition-colors">
                        <CloseCircle className="w-8 h-8" />
                    </button>
                </div>

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
                            className="min-h-[100px]"
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
            </div>
        </div>
    );
}
