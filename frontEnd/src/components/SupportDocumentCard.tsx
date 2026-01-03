import { File, Download } from 'flowbite-react-icons/solid';
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
        year: 'numeric'
    });

    return (
        <div
            onClick={onClick}
            className="group w-full p-4 rounded-xl bg-surface border border-onSurface/10 hover:border-onSurface/30 hover:shadow-sm transition-all cursor-pointer flex gap-4 items-center"
        >
            {/* Icon Placeholder */}
            <div className="shrink-0 w-16 h-16 bg-surfaceVariant/30 rounded-lg flex items-center justify-center text-onSurfaceVariant">
                <File className="w-8 h-8 opacity-50" />
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex justify-between items-center w-full">
                    <h4 className="text-title-medium text-onSurface font-bold truncate pr-4">{document.title}</h4>
                    <span className="text-body-small text-onSurfaceVariant shrink-0">{dateString}</span>
                </div>
                <p className="text-body-medium text-onSurface/70 line-clamp-2">
                    {document.description || "Sin descripción."}
                </p>
            </div>

            {/* Download Button */}
            <button
                onClick={onDownload}
                className="shrink-0 w-10 h-10 rounded-full border border-onSurface/20 flex items-center justify-center text-onSurface hover:bg-surfaceVariant/10 hover:border-onSurface/50 transition-colors z-10"
                title="Descargar documento"
            >
                <Download className="w-5 h-5" />
            </button>
        </div>
    );
}
