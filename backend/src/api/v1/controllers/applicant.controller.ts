import type { Request, Response } from 'express';
import applicantService from '../services/applicant.service.js';

export async function getAllApplicant(req: Request, res: Response): Promise<void> {
  try {
    const result = await applicantService.getAllApplicants();
    
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
    // IMPORTANTE: No usamos parseInt porque identityCard es VARCHAR en tu DB
    const { id } = req.params; 

    const result = await applicantService.getApplicantById(id);

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

    // Validación básica coincidiendo con tu ApplicantResponse
    if (!data.identityCard || !data.fullName) {
       res.status(400).json({ success: false, message: 'Faltan campos requeridos: identityCard y fullName son obligatorios.' });
       return;
    }

    const result = await applicantService.createApplicant(data);

    if (!result.success) {
      res.status(400).json(result); // 400 Bad Request si falló la lógica de negocio (ej. duplicado)
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
      // Puede ser 404 (no encontrado) o 400 (error de datos), asumimos 400 o el mensaje del servicio
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
      res.status(404).json(result); // Asumimos 404 si no se pudo borrar porque no existía
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido al eliminar';
    res.status(500).json({ success: false, error: msg });
  }
}

export const deleteApplicantById = deleteApplicant;

// Nota: getFullProfile era idéntico a getApplicantById. 
// Si no tiene lógica diferente, usa getApplicantById en la ruta.
// Si necesitas mantenerlo separado por semántica, aquí está reutilizando la lógica:
export const getFullProfile = getApplicantById;