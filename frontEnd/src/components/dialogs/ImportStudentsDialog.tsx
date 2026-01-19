import { useState, useRef } from 'react';
import Button from '#components/Button.tsx';
import Dialog from '#components/dialogs/Dialog.tsx';
import { Upload, File } from "flowbite-react-icons/solid";
import LoadingSpinner from '#components/LoadingSpinner.tsx';

interface ImportStudentsDialogProps {
    open: boolean;
    onClose: () => void;
    onImport: (file: File) => Promise<any>;
    isLoading?: boolean;
}

export default function ImportStudentsDialog({
    open,
    onClose,
    onImport,
    isLoading = false
}: ImportStudentsDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [importResult, setImportResult] = useState<any | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!open) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setImportResult(null);
            setGeneralError(null);
        }
    };

    const handleUpload = async () => {
        if (!file || isLoading) return;

        setIsUploading(true);
        setGeneralError(null);
        try {
            const result = await onImport(file);
            setImportResult(result);
        } catch (error: any) {
            console.error("Error importing students:", error);
            setGeneralError(error.message || "Ocurrió un error inesperado al subir el archivo.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setImportResult(null);
        setGeneralError(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            title="Importar Estudiantes"
            onClose={handleClose}
        >
            <div className="flex flex-col gap-6">
                {generalError && (
                    <div className="p-4 bg-error/10 border border-error/30 rounded-2xl text-error text-body-medium">
                        {generalError}
                    </div>
                )}

                {!importResult ? (
                    <>
                        <div className="flex flex-col gap-2">
                            <p className="text-body-medium text-onSurface/70">
                                Seleccione un archivo <strong>.xlsx</strong> o <strong>.csv</strong> con la información de los estudiantes.
                            </p>
                            <div className="bg-surface-variant/30 p-4 rounded-xl border border-onSurface/10">
                                <h4 className="text-label-medium mb-2">Columnas requeridas:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['CEDULA', 'NOMBRE_ESTUDIANTE', 'CRN', 'YEAR_TERM', 'ESTU_EMAIL_ADDRESS'].map(col => (
                                        <span key={col} className="px-2 py-1 bg-surface rounded text-body-small border border-onSurface/5 font-mono">
                                            {col}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
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
                                    setImportResult(null);
                                    setGeneralError(null);
                                }
                            }}
                            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${isDragging ? 'border-primary bg-primary/10' : (file ? 'border-primary/50 bg-primary/5' : 'border-onSurface/20 hover:border-primary/30 hover:bg-surface-variant/20')}`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".xlsx, .csv"
                                className="hidden"
                            />
                            {file ? (
                                <div className="flex items-center gap-3">
                                    <File className="size-10 text-primary" />
                                    <div className="flex flex-col">
                                        <span className="text-body-large font-medium truncate max-w-[280px]" title={file.name}>{file.name}</span>
                                        <span className="text-body-small text-onSurface/60">{(file.size / 1024).toFixed(2)} KB</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="size-12 text-onSurface/40" />
                                    <span className="text-body-medium text-onSurface/60">Haz clic para seleccionar un archivo</span>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className={`p-4 rounded-2xl border ${importResult.success ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
                            <h3 className={`text-title-medium font-bold ${importResult.success ? 'text-success' : 'text-warning'}`}>
                                {importResult.message}
                            </h3>
                            {importResult.data && (
                                <div className="mt-2 text-body-medium flex flex-col gap-1">
                                    <span>Total: <strong>{importResult.data.total}</strong></span>
                                    <span className="text-success">Éxito: <strong>{importResult.data.success}</strong></span>
                                    {importResult.data.failed > 0 && (
                                        <span className="text-error">Fallidos: <strong>{importResult.data.failed}</strong></span>
                                    )}
                                </div>
                            )}
                        </div>

                        {importResult.data?.errors?.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="text-label-medium text-error">Errores encontrados:</span>
                                <div className="max-h-40 overflow-y-auto bg-surface-variant/20 rounded-xl p-3 border border-onSurface/5">
                                    <ul className="list-disc pl-5 text-body-small text-onSurface/80 flex flex-col gap-1">
                                        {importResult.data.errors.map((err: string, i: number) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
                {importResult ? (
                    <Button
                        variant="resalted"
                        onClick={handleClose}
                        className="min-w-32"
                    >
                        Cerrar
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="resalted"
                            onClick={handleUpload}
                            disabled={!file || isUploading || isLoading}
                            className="min-w-48"
                            icon={(isUploading || isLoading) ? <LoadingSpinner /> : <Upload />}
                        >
                            {(isUploading || isLoading) ? 'Procesando...' : 'Iniciar Carga'}
                        </Button>
                    </>
                )}
            </div>
        </Dialog>
    );
}
