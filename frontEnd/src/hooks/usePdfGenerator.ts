import { useState } from 'react';
import { generatePdfFromElement, generatePdfFromHtml, type PdfOptions } from '../utils/pdfUtils';

export interface UsePdfGeneratorReturn {
    generateFromElement: (elementId: string, options?: PdfOptions) => Promise<void>;
    generateFromHtml: (htmlString: string, options?: PdfOptions) => Promise<void>;
    isGenerating: boolean;
    error: Error | null;
}

/**
 * Hook personalizado para generar PDFs
 * Maneja el estado de carga y errores
 */
export function usePdfGenerator(): UsePdfGeneratorReturn {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const generateFromElement = async (elementId: string, options?: PdfOptions): Promise<void> => {
        setIsGenerating(true);
        setError(null);
        try {
            await generatePdfFromElement(elementId, options);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido al generar PDF');
            setError(error);
            throw error;
        } finally {
            setIsGenerating(false);
        }
    };

    const generateFromHtml = async (htmlString: string, options?: PdfOptions): Promise<void> => {
        setIsGenerating(true);
        setError(null);
        try {
            await generatePdfFromHtml(htmlString, options);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido al generar PDF');
            setError(error);
            throw error;
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        generateFromElement,
        generateFromHtml,
        isGenerating,
        error
    };
}
