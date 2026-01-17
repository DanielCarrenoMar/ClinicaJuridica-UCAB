import type { Request, Response } from 'express';
import applicantService from '../services/applicant.service.js';
import { parsePagination } from '../utils/pagination.util.js';

export async function getAllApplicant(req: Request, res: Response): Promise<void> {
  try {
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const result = await applicantService.getAllApplicants(pagination);
    
    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido al obtener solicitantes';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getApplicantById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params; 

    const result = await applicantService.getApplicantById(id);

    if (result.error) {
      res.status(500).json(result);
      return;
    }

    if (!result.success || !result.data) {
      res.status(404).json({ success: false, message: 'Solicitante no encontrado' });
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido al buscar solicitante';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function createApplicant(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;

    const missing: string[] = [];
    if (!data.identityCard) missing.push('identityCard');
    if (!data.fullName) missing.push('fullName');
    if (!data.gender) missing.push('gender');
    if (!data.birthDate) missing.push('birthDate');
    if (!data.idNationality) missing.push('idNationality');

    if (missing.length > 0) {
      res.status(400).json({
        success: false,
        message: `Faltan campos requeridos: ${missing.join(', ')}`
      });
      return;
    }

    console.log("Creating applicant with identityCard:", data);

    const result = await applicantService.createApplicant(data);

    if (!result.success) {
      res.status(400).json(result); 
      return;
    }

    res.status(201).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido al crear solicitante';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function updateApplicant(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await applicantService.updateApplicant(id, req.body);

    if (!result.success) {
      res.status(400).json(result); 
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido al actualizar';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function deleteApplicant(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await applicantService.deleteApplicant(id);

    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido al eliminar';
    res.status(500).json({ success: false, error: msg });
  }
}

export const deleteApplicantById = deleteApplicant;

export const getFullProfile = getApplicantById;