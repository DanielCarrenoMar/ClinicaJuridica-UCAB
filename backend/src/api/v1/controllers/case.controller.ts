import type { Request, Response } from 'express';
import caseService from '../services/case.service.js';

export async function getAllCases(req: Request, res: Response): Promise<void> {
  try {
    const { q } = req.query;

    const result = q && typeof q === 'string'
      ? await caseService.searchCases(q)
      : await caseService.getAllCases();

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

    if (
      !caseData.problemSummary || 
      !caseData.processType || 
      !caseData.applicantId || 
      !caseData.idLegalArea ||
      !caseData.term
    ) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios para el expediente'
      });
      return;
    }

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

export async function updateCase(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const result = await caseService.updateCase(caseId, req.body);
    
    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function deleteCase(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
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

export async function changeStatus(req: Request, res: Response): Promise<void> {
  try {
    const caseId = parseInt(req.params.id);
    const { description, date } = req.body;

    if (isNaN(caseId) || !description) {
      res.status(400).json({ success: false, message: 'ID o descripción faltante' });
      return;
    }

    const result = await caseService.changeCaseStatus(caseId, description, date);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getTimeline(req: Request, res: Response): Promise<void> {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const result = await caseService.getCaseTimeline(caseId);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function assignStudent(req: Request, res: Response): Promise<void> {
  try {
    const caseId = parseInt(req.params.id);
    const { studentId } = req.body;

    if (isNaN(caseId) || !studentId) {
      res.status(400).json({ success: false, message: 'Datos incompletos para la asignación' });
      return;
    }

    const result = await caseService.assignStudentToCase(caseId, studentId);
    res.status(201).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getStudentHistory(req: Request, res: Response): Promise<void> {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const result = await caseService.getAssignedStudents(caseId);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getActionsFromCaseId(req: Request, res: Response): Promise<void> {
  try{
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)){
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }
    const result = await caseService.getActionsFromCaseId(caseId);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function addAction(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, message: "Funcionalidad 'Agregar Acción' no implementada aún" });
}

export async function scheduleAppointment(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, message: "Funcionalidad 'Agendar Cita' no implementada aún" });
}

export async function updateAppointmentStatus(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, message: "Funcionalidad 'Actualizar Cita' no implementada aún" });
}

export async function getDocuments(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, message: "Funcionalidad 'Ver Documentos' no implementada aún" });
}

export async function addDocument(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, message: "Funcionalidad 'Subir Documento' no implementada aún" });
}

export async function deleteDocument(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, message: "Funcionalidad 'Eliminar Documento' no implementada aún" });
}