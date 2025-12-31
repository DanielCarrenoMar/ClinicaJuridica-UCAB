import type { Request, Response } from 'express';
import applicantService from '../services/applicant.service.js';

export async function getAllApplicant(req: Request, res: Response): Promise<void> {
  try {
    const result = await applicantService.getAllApplicants();
    if (result.error) {
      res.status(500).json({ success: false, error: result.error });
      return;
    }
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getApplicantById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await applicantService.getApplicantById(id);
    if (result.error) {
      res.status(500).json({ success: false, error: result.error });
      return;
    }
    if (!result.success || !result.data) {
      res.status(404).json({ success: false, message: 'Solicitante no encontrado' });
      return;
    }
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function createApplicant(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    if (!data.identityCard || !data.name || !data.email) {
      res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
      return;
    }
    const result = await applicantService.createApplicant(data);
    res.status(201).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function updateGeneralInfo(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await applicantService.updateApplicant(id, req.body);
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function deleteApplicantbyId(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await applicantService.deleteApplicant(id);
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getFullProfile(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await applicantService.getApplicantById(id);
    
    if (!result.success || !result.data) {
      res.status(404).json({ success: false, message: 'Solicitante no encontrado' });
      return;
    }
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}