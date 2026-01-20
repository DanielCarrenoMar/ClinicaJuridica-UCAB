// @ts-nocheck
import type { Request, Response } from 'express';
import reportService from '../services/report.service.js';

export async function getCasesBySubject(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    // Validar que si se proporciona una fecha, ambas estén presentes
    if ((startDate && !endDate) || (!startDate && endDate)) {
      res.status(400).json({ 
        success: false, 
        error: 'Se deben proporcionar ambas fechas (inicio y fin) o ninguna' 
      });
      return;
    }

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      res.status(400).json({ 
        success: false, 
        error: 'La fecha de inicio debe ser anterior a la fecha de fin' 
      });
      return;
    }

    const result = await reportService.getCasesBySubject(parsedStartDate, parsedEndDate);
    
    if (!result.success) {
      res.status(500).json({ success: false, error: result.error });
      return;
    }
    
    res.status(200).json(result);
  } catch (error: unknown) {
    console.error('Error en getCasesBySubject:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getCasesBySubjectScope(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getCasesBySubjectScope(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getGenderDistribution(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getGenderDistribution(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getStateDistribution(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getStateDistribution(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getParishDistribution(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getParishDistribution(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getCasesByType(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getCasesByType(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getBeneficiariesByParish(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getBeneficiariesByParish(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getStudentInvolvement(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getStudentInvolvement(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getCasesByServiceType(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getCasesByServiceType(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getProfessorInvolvement(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getProfessorInvolvement(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getBeneficiaryTypeDistribution(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await reportService.getBeneficiaryTypeDistribution(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}
