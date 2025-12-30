import type { Request, Response } from 'express';
import applicantService from '../services/applicant.service.js';

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const { q } = req.query;
    const result = q && typeof q === 'string'
      ? await applicantService.searchApplicants(q)
      : await applicantService.getAllApplicants();

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
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

export async function create(req: Request, res: Response): Promise<void> {
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

export async function deleteApplicant(req: Request, res: Response): Promise<void> {
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

export async function updateHousing(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await applicantService.updateHousing(id, req.body);
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function updateFamily(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await applicantService.updateFamily(id, req.body);
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getApplicantCases(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await applicantService.getApplicantCases(id);
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}