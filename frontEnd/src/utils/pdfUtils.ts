import html2pdf from 'html2pdf.js';

export interface PdfOptions {
    filename?: string;
    margin?: number | [number, number, number, number];
    imageType?: 'jpeg' | 'png';
    imageQuality?: number;
    scale?: number;
    format?: 'a4' | 'letter' | 'legal';
    orientation?: 'portrait' | 'landscape';
}

/**
 * Genera y descarga un PDF a partir de un elemento HTML del DOM
 * @param elementId ID del elemento HTML que se convertirá a PDF
 * @param options Opciones de configuración para el PDF
 */
export async function generatePdfFromElement(
    elementId: string,
    options: PdfOptions = {}
): Promise<void> {
    const element = document.getElementById(elementId);
    
    if (!element) {
        throw new Error(`No se encontró el elemento con ID: ${elementId}`);
    }

    const {
        filename = `documento_${Date.now()}.pdf`,
        margin = 1,
        imageType = 'jpeg',
        imageQuality = 0.98,
        scale = 2,
        format = 'a4',
        orientation = 'portrait'
    } = options;

    const pdfOptions = {
        margin: margin,
        filename: filename,
        image: { 
            type: imageType, 
            quality: imageQuality 
        },
        html2canvas: { 
            scale: scale, 
            useCORS: true, 
            letterRendering: true,
            logging: false
        },
        jsPDF: { 
            unit: 'mm', 
            format: format, 
            orientation: orientation 
        }
    };

    try {
        await html2pdf().set(pdfOptions).from(element).save();
    } catch (error) {
        console.error("Error al generar PDF:", error);
        throw error;
    }
}

/**
 * Genera un PDF a partir de HTML string (sin elemento en el DOM)
 * @param htmlString Contenido HTML como string
 * @param options Opciones de configuración para el PDF
 */
export async function generatePdfFromHtml(
    htmlString: string,
    options: PdfOptions = {}
): Promise<void> {
    const {
        filename = `documento_${Date.now()}.pdf`,
        margin = 1,
        imageType = 'jpeg',
        imageQuality = 0.98,
        scale = 2,
        format = 'a4',
        orientation = 'portrait'
    } = options;

    const pdfOptions = {
        margin: margin,
        filename: filename,
        image: { 
            type: imageType, 
            quality: imageQuality 
        },
        html2canvas: { 
            scale: scale, 
            useCORS: true, 
            letterRendering: true,
            logging: false
        },
        jsPDF: { 
            unit: 'mm', 
            format: format, 
            orientation: orientation 
        }
    };

    try {
        await html2pdf().set(pdfOptions).from(htmlString).save();
    } catch (error) {
        console.error("Error al generar PDF:", error);
        throw error;
    }
}
