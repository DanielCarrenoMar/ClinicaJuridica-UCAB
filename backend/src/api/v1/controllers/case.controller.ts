import type { Request, Response } from 'express';
import caseService from '../services/case.service.js';

export async function getAllCases(req: Request, res: Response): Promise<void> {
  try {
    // El controlador pide al servicio los datos
    const result = await caseService.getAllCases();
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getCaseById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID de caso inválido' });
      return;
    }

    // El controlador depende del servicio para buscar la data
    const result = await caseService.getCaseById(caseId);
    
    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: errorMessage });
  }
}

export async function createCase(req: Request, res: Response): Promise<void> {
  try {
    const caseData = req.body;

    // Validación de entrada antes de llamar al servicio
    if (
      !caseData.problemSummary || 
      !caseData.processType || 
      !caseData.applicantId || 
      !caseData.idLegalArea ||
      !caseData.teacherId ||
      !caseData.term
    ) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios para el expediente'
      });
      return;
    }

    // El controlador envía la data limpia al servicio
    const result = await caseService.createCase(caseData);
    
    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function searchCases(req: Request, res: Response): Promise<void> {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({ success: false, message: 'Término de búsqueda requerido' });
      return;
    }

    const result = await caseService.searchCases(q);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function deleteCase(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const result = await caseService.deleteCase(caseId);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}