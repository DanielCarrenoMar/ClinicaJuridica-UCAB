import { useState, useEffect } from 'react';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';

interface EditSupportDocumentDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (idCase: number, supportNumber: number, data: { title: string; description: string; file?: File }) => void;
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
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (document) {
            setTitle(document.title);
            setDescription(document.description);
            setFile(null);
        }
    }, [document]);

    if (!open || !document) return null;

    const handleSubmit = () => {
        if (!title || !description) return;

        onSave(document.idCase, document.supportNumber, {
            title,
            description,
            file: file || undefined
        });
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
                    <label className="flex items-center px-1.5 w-full text-label-small">
                        Título
                    </label>
                    <TextInput
                        placeholder="Ingrese el título del recaudo..."
                        onChangeText={setTitle}
                        value={title}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="flex items-center px-1.5 w-full text-label-small">
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

                <div className="flex flex-col gap-2">
                    <label className="flex items-center px-1.5 w-full text-label-small">
                        Documento Adjunto
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            id="edit-file-upload"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => window.document.getElementById('edit-file-upload')?.click()}
                            className="flex-1"
                        >
                            {file ? 'Cambiar Archivo' : document.fileUrl ? 'Reemplazar Archivo' : 'Seleccionar Archivo'}
                        </Button>
                        {(file || document.fileUrl) && (
                            <span className="text-body-small truncate max-w-[150px]" title={file ? file.name : 'Archivo actual'}>
                                {file ? file.name : '✓ Archivo adjunto'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <Button
                    variant="resalted"
                    onClick={handleSubmit}
                    disabled={!title || !description}
                    className="min-w-48 w-1/2"
                >
                    Guardar Cambios
                </Button>
            </div>
        </Dialog>
    );
}
