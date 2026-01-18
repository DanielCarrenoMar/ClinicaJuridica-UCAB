import type { Request, Response } from 'express';
import supportDocumentService from '../services/supportDocument.service.js';
import { supabase } from '../../../config/supabase.config.js';
import { parsePagination } from '../utils/pagination.util.js';

export async function getAllSupportDocuments(req: Request, res: Response): Promise<void> {
    try {
        const pagination = parsePagination(req.query as Record<string, unknown>);
        const result = await supportDocumentService.getAllSupportDocuments(pagination);

        if (!result.success) {
            res.status(500).json(result);
            return;
        }

        res.status(200).json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al obtener documentos';
        res.status(500).json({ success: false, error: msg });
    }
}

export async function getSupportDocumentById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        // As with appointments, fetching by single ID is ambiguous without supportNumber.
        // Assuming usage might be limited or requires query params if expanded later.
        res.status(501).json({ success: false, message: 'Fetching by single ID not fully supported for composite key Documents.' });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al buscar documento';
        res.status(500).json({ success: false, error: msg });
    }
}

export async function createSupportDocument(req: Request, res: Response): Promise<void> {
    try {
        const data = req.body;

        // When using multer, files are multipart. Make sure strings are parsed if needed.
        if (typeof data.idCase === 'string') data.idCase = parseInt(data.idCase);

        if (!data.idCase || !data.title || !data.description || !data.submissionDate) {
            res.status(400).json({ success: false, message: 'Faltan campos requeridos (idCase, title, description, submissionDate).' });
            return;
        }

        // If a file was uploaded, upload to Supabase
        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('recaudos')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                res.status(500).json({ success: false, message: 'Error al subir el archivo a la nube.' });
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('recaudos')
                .getPublicUrl(uploadData.path);

            data.fileUrl = publicUrlData.publicUrl;
        }

        const result = await supportDocumentService.createSupportDocument(data);

        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(201).json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al crear documento';
        res.status(500).json({ success: false, error: msg });
    }
}

export async function updateSupportDocument(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params; // Treating id as idCase
        const data = req.body;

        if (!data.supportNumber) {
            res.status(400).json({ success: false, message: 'Se requiere supportNumber en el cuerpo de la solicitud.' });
            return;
        }

        const idCase = parseInt(id);
        const supportNumber = parseInt(data.supportNumber);

        // If a file was uploaded, upload to Supabase and CLEAN UP the old one
        if (req.file) {
            // 1. Get the current document to find the OLD fileUrl
            const currentDoc = await supportDocumentService.getSupportDocumentById(idCase, supportNumber);

            if (currentDoc.success && currentDoc.data.fileUrl) {
                const oldFileUrl = currentDoc.data.fileUrl;
                const oldFileNameEncoded = oldFileUrl.split('/').pop();
                if (oldFileNameEncoded) {
                    const oldFileName = decodeURIComponent(oldFileNameEncoded);
                    console.log(`🗑️ Cleaning up old file: "${oldFileName}"`);
                    await supabase.storage.from('recaudos').remove([oldFileName]);
                }
            }

            // 2. Upload the NEW file
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('recaudos')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                res.status(500).json({ success: false, message: 'Error al actualizar el archivo en la nube.' });
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('recaudos')
                .getPublicUrl(uploadData.path);

            data.fileUrl = publicUrlData.publicUrl;
        }

        const result = await supportDocumentService.updateSupportDocument(idCase, supportNumber, data);

        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(200).json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al actualizar documento';
        res.status(500).json({ success: false, error: msg });
    }
}

export async function deleteSupportDocument(req: Request, res: Response): Promise<void> {
    try {
        const { id, supportNumber } = req.params;
        const idCaseInt = parseInt(id);
        const supportNumberInt = parseInt(supportNumber);

        // 1. Get the document to find the fileUrl
        const document = await supportDocumentService.getSupportDocumentById(idCaseInt, supportNumberInt);

        if (document.success && document.data.fileUrl) {
            const fileUrl: string = document.data.fileUrl;
            // Extract the filename and decode it (to handle spaces/special chars)
            const fileNameEncoded = fileUrl.split('/').pop();

            if (fileNameEncoded) {
                const fileName = decodeURIComponent(fileNameEncoded);
                console.log(`🗑️ Attempting to delete file from Supabase: "${fileName}"`);

                const { error: deleteError } = await supabase.storage
                    .from('recaudos')
                    .remove([fileName]);

                if (deleteError) {
                    console.error('⚠️ Could not delete file from Supabase:', deleteError);
                    // We continue anyway to at least clean up the database
                }
            }
        }

        // 2. Delete from database
        const result = await supportDocumentService.deleteSupportDocument(idCaseInt, supportNumberInt);

        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(200).json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al eliminar documento';
        res.status(500).json({ success: false, error: msg });
    }
}
