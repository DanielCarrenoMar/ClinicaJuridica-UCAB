import { useState } from 'react';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';

interface AddSupportDocumentDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (document: { title: string; description: string; submissionDate: Date; file?: File }) => void;
}

export default function AddSupportDocumentDialog({
    open,
    onClose,
    onAdd
}: AddSupportDocumentDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    if (!open) return null;

    const handleSubmit = () => {
        if (!title || !description) return;

        onAdd({
            title,
            description,
            submissionDate: new Date(),
            file: file || undefined
        });

        // Reset form
        setTitle("");
        setDescription("");
        setFile(null);
        onClose();
    };

    return (
        <Dialog open={open} title="Nuevo Recaudo" onClose={onClose}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="flex items-center px-1.5 w-full text-label-small">
                        Título*
                    </label>
                    <TextInput
                        placeholder="Ingrese el título del recaudo..."
                        onChangeText={setTitle}
                        value={title}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="flex items-center px-1.5 w-full text-label-small">
                        Descripción*
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
                    <div
                        className={`flex items-center gap-3 p-2 rounded-xl border-2 border-dashed transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(false);
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(false);
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                setFile(e.dataTransfer.files[0]);
                            }
                        }}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className={file ? "min-w-24 px-3" : "flex-1"}
                        >
                            {file ? 'Cambiar Archivo' : 'Seleccionar Archivo'}
                        </Button>
                        {file && (
                            <span className="text-body-small truncate max-w-[180px]" title={file.name}>
                                {file.name}
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
                    Añadir Recaudo
                </Button>
            </div>
        </Dialog>
    );
}
