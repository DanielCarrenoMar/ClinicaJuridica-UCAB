import { useState, useEffect } from 'react';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';

interface EditSupportDocumentDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (idCase: number, supportNumber: number, data: Partial<SupportDocumentModel>) => void;
    document: SupportDocumentModel | null;
}

export default function EditSupportDocumentDialog({
    open,
    onClose,
    onSave,
    document
}: EditSupportDocumentDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        if (document) {
            setTitle(document.title);
            setDescription(document.description);
            setFileUrl(document.fileUrl || "");
        }
    }, [document]);

    if (!open || !document) return null;

    const handleSubmit = () => {
        if (!title || !description) return;

        const updateData: Partial<SupportDocumentModel> = {
            title,
            description,
            fileUrl: fileUrl || undefined
        };

        onSave(document.idCase, document.supportNumber, updateData);
        onClose();
    };

    return (
        <Dialog
            open={open}
            title={`Editar Recaudo #${document.supportNumber}`}
            onClose={onClose}
        >
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
                    Guardar Cambios
                </Button>
            </div>
        </Dialog>
    );
}
