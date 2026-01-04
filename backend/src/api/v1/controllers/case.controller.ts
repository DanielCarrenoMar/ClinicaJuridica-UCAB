import type { Request, Response } from 'express';
import caseService from '../services/case.service.js';
import caseActionService from '../services/caseAction.service.js';

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

    const missingFields = [];
    if (!caseData.problemSummary) missingFields.push('problemSummary');
    if (!caseData.processType) missingFields.push('processType');
    if (!caseData.applicantId) missingFields.push('applicantId');
    if (!caseData.idLegalArea) missingFields.push('idLegalArea');

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: `Faltan campos obligatorios para el expediente: ${missingFields.join(', ')}`
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

export async function getActionsInfoFromCaseId(req: Request, res: Response): Promise<void> {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const result = await caseService.getActionsInfoFromCaseId(caseId);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function addAction(req: Request, res: Response): Promise<void> {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const payload = {
      ...req.body,
      idCase: caseId
    };

    const result = await caseActionService.createCaseAction(payload);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getBeneficiariesFromCaseId(req: Request, res: Response): Promise<void> {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const result = await caseService.getBeneficiariesFromCaseId(caseId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getCaseStatusFromCaseId(req: Request, res: Response): Promise<void> {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const result = await caseService.getCaseStatusFromCaseId(caseId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function changeCaseStatus(req: Request, res: Response): Promise<void> {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const { statusEnum, reason, userId } = req.body;
    if (!statusEnum || !userId) {
      res.status(400).json({ success: false, message: 'Faltan campos requeridos: statusEnum, userId' });
      return;
    }

    const result = await caseService.changeCaseStatus(caseId, statusEnum, reason, userId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getStatusCaseAmount(req: Request, res: Response): Promise<void> {
  try {
    const result = await caseService.getStatusCaseAmount();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
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

export async function createDocumentByCaseId(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, message: "Funcionalidad 'Subir Documento' no implementada aún" });
}

export async function deleteDocument(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, message: "Funcionalidad 'Eliminar Documento' no implementada aún" });
}

export async function getDocumentByCaseId(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, message: "Funcionalidad 'Eliminar Documento' no implementada aún" });
}

export async function createStatusForCaseId(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID de caso inválido' });
      return;
    }

    const data = req.body;

    if (!data.status || !data.userId) {
      res.status(400).json({ success: false, message: 'Los campos "status" y "userId" son obligatorios' });
      return;
    }

    const validStatuses = ['A', 'T', 'P', 'C'];
    if (!validStatuses.includes(data.status)) {
      res.status(400).json({ success: false, message: 'Status inválido. Valores permitidos: A, T, P, C' });
      return;
    }

    const result = await caseService.createStatusForCaseId(caseId, data);
    
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

export async function getStudentsFromCaseId(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID de caso inválido' });
      return;
    }

    const result = await caseService.getStudentsFromCaseId(caseId);
    
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

export async function getAppoitmentByCaseId(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID de caso inválido' });
      return;
    }

    const result = await caseService.getAppoitmentByCaseId(caseId);
    
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

export async function createAppoitmentForCaseId(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID de caso inválido' });
      return;
    }

    const data = req.body;

    if (!data.plannedDate || !data.userId) {
      res.status(400).json({ 
        success: false, 
        message: 'Los campos "plannedDate" y "userId" son obligatorios' 
      });
      return;
    }

    if (data.status && !['C', 'P', 'R'].includes(data.status)) {
      res.status(400).json({ 
        success: false, 
        message: 'Status inválido. Valores permitidos: C (Cancelled), P (Scheduled), R (Completed)' 
      });
      return;
    }

    const result = await caseService.createAppoitmentForCaseId(caseId, data);
    
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

export async function getSupportDocumentsById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID de caso inválido' });
      return;
    }

    const result = await caseService.getSupportDocumentsById(caseId);
    
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

export async function createSupportDocumentForCaseId(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      res.status(400).json({ success: false, message: 'ID de caso inválido' });
      return;
    }

    const data = req.body;

    // Validación de campos obligatorios
    if (!data.title || !data.description) {
      res.status(400).json({ 
        success: false, 
        message: 'Los campos "title" y "description" son obligatorios' 
      });
      return;
    }

    const result = await caseService.createSupportDocumentForCaseId(caseId, data);
    
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