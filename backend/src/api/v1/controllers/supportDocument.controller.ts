import type { Request, Response } from 'express';
import supportDocumentService from '../services/supportDocument.service.js';

export async function getAllSupportDocuments(req: Request, res: Response): Promise<void> {
    try {
        const result = await supportDocumentService.getAllSupportDocuments();

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

        if (!data.idCase || !data.title || !data.description || !data.submissionDate) {
            res.status(400).json({ success: false, message: 'Faltan campos requeridos (idCase, title, description, submissionDate).' });
            return;
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
        const supportNumber = data.supportNumber;

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
