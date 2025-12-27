import type { Request, Response } from 'express';
import applicantService from '../services/applicant.service.js';

export async function getAllApplicants(req: Request, res: Response): Promise<void> {
  try {
    const result = await applicantService.getAllApplicants();
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getApplicantById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id; // La cédula es un String en tu esquema
    
    if (!id) {
      res.status(400).json({ success: false, message: 'Cédula no proporcionada' });
      return;
    }

    const result = await applicantService.getApplicantById(id);
    
    if (!result) {
      res.status(404).json({ success: false, message: 'Solicitante no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: errorMessage });
  }
}

export async function searchApplicants(req: Request, res: Response): Promise<void> {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({ success: false, message: 'Término de búsqueda requerido' });
      return;
    }

    const result = await applicantService.searchApplicants(q);
    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function createApplicant(req: Request, res: Response): Promise<void> {
  try {
    const applicantData = req.body;

    // Validación según los nombres de tu esquema (identityCard, name)
    if (!applicantData.identityCard || !applicantData.name || !applicantData.email) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: cédula, nombre o correo'
      });
      return;
    }

    const result = await applicantService.createApplicant(applicantData);
    res.status(201).json({ success: true, data: result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function updateApplicant(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await applicantService.updateApplicant(id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function deleteApplicant(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    await applicantService.deleteApplicant(id);
    res.status(200).json({ success: true, message: 'Solicitante eliminado' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getApplicantCases(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await applicantService.getApplicantCases(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}