import { Download } from 'flowbite-react-icons/solid';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts';

interface SupportDocumentCardProps {
    document: SupportDocumentModel;
    onClick: () => void;
    onDownload: (e: React.MouseEvent) => void;
}

export default function SupportDocumentCard({ document, onClick, onDownload }: SupportDocumentCardProps) {
    const dateString = document.submissionDate.toLocaleDateString("es-ES", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (document.fileUrl) {
            window.open(document.fileUrl, '_blank');
        } else {
            onDownload(e);
        }
    };

    return (
        <div
            onClick={onClick}
            className="group w-full py-2.5 px-4 rounded-3xl bg-surface/70 hover:bg-surface border border-onSurface/30 hover:border-onSurface/40 transition-all cursor-pointer flex flex-col gap-2"
        >
            <header className="flex justify-between items-center w-full">
                <h4 className="text-body-large font-bold">
                    {document.title}
                </h4>
                <div className="flex items-center gap-3">
                    <span className="text-body-medium">
                        <strong className='text-body-large'>Recibido el</strong> {dateString}
                    </span>
                    {document.fileUrl && (
                        <button
                            onClick={handleDownload}
                            className="shrink-0 w-8 h-8 rounded-full border border-onSurface/20 flex items-center justify-center text-onSurface hover:bg-surfaceVariant/20 hover:border-onSurface/50 transition-colors z-10"
                            title="Descargar documento"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </header>

        </div>
    );
}
