import { Download, FilePdf } from 'flowbite-react-icons/solid';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts';
import { usePdfGenerator } from '../hooks/usePdfGenerator.ts';
import { useRef } from 'react';

interface SupportDocumentCardProps {
    document: SupportDocumentModel;
    onClick: () => void;
    onDownload: (e: React.MouseEvent) => void;
}

export default function SupportDocumentCard({ document, onClick, onDownload }: SupportDocumentCardProps) {
    const { generateFromElement, isGenerating } = usePdfGenerator();
    const pdfContentId = `pdf-content-${document.idCase}-${document.supportNumber}`;
    const pdfRef = useRef<HTMLDivElement>(null);

    const dateString = document.submissionDate.toLocaleDateString("es-ES", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });

    const formattedDate = document.submissionDate.toLocaleDateString("es-ES", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (document.fileUrl) {
            window.open(document.fileUrl, '_blank');
        } else {
            onDownload(e);
        }
    };

    const handleGeneratePdf = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const filename = `Recaudo_${document.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`;
            await generateFromElement(pdfContentId, {
                filename: filename,
                format: 'a4',
                orientation: 'portrait',
                margin: [10, 10, 10, 10]
            });
        } catch (error) {
            console.error('Error generando PDF:', error);
        }
    };

    return (
        <>
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
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleGeneratePdf}
                                disabled={isGenerating}
                                className="shrink-0 w-8 h-8 rounded-full border border-onSurface/20 flex items-center justify-center text-onSurface hover:bg-surfaceVariant/20 hover:border-onSurface/50 transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Generar PDF del documento"
                            >
                                <FilePdf className="w-4 h-4" />
                            </button>
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
                    </div>
                </header>
            </div>

            {/* Contenido oculto para generar PDF */}
            <div ref={pdfRef} className="hidden">
                <div 
                    id={pdfContentId} 
                    className="p-10 bg-white text-black font-sans"
                    style={{ width: '210mm', minHeight: '297mm' }}
                >
                    <header className="border-b-2 border-blue-800 pb-4 mb-6">
                        <h1 className="text-3xl font-bold text-blue-900 mb-2">Clínica Jurídica UCAB</h1>
                        <p className="text-gray-600 text-lg">Recaudo de Documento</p>
                    </header>
                    
                    <main className="space-y-6 mt-8">
                        <section>
                            <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">
                                Información del Recaudo
                            </h2>
                            <div className="space-y-3 text-base">
                                <p><strong className="font-bold">Título:</strong> {document.title}</p>
                                <p><strong className="font-bold">Fecha de Entrega:</strong> <span className="capitalize">{formattedDate}</span></p>
                                {document.description && (
                                    <div className="mt-4">
                                        <p className="font-bold mb-2">Descripción:</p>
                                        <p className="text-gray-700 whitespace-pre-wrap">{document.description}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {document.fileUrl && (
                            <section className="mt-6">
                                <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">
                                    Archivo Adjunto
                                </h2>
                                <p className="text-base text-gray-700 break-all">{document.fileUrl}</p>
                            </section>
                        )}
                    </main>

                    <footer className="mt-20 pt-6 border-t-2 border-gray-300 text-xs text-center text-gray-500">
                        <p>Este documento fue generado automáticamente por el sistema de Clínica Jurídica UCAB</p>
                        <p className="mt-2">Fecha de generación: {new Date().toLocaleString('es-ES')}</p>
                        <p className="mt-1">Documento confidencial - Propiedad de la UCAB</p>
                    </footer>
                </div>
            </div>
        </>
    );
}
