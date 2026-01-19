// @ts-nocheck
import type { Request, Response } from 'express';
import statsService from '../services/stats.service.js';

export async function getCasesBySubject(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await statsService.getCasesBySubject(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getCasesBySubjectScope(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

    const result = await statsService.getCasesBySubjectScope(parsedStartDate, parsedEndDate);
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

    const result = await statsService.getGenderDistribution(parsedStartDate, parsedEndDate);
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

    const result = await statsService.getStateDistribution(parsedStartDate, parsedEndDate);
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

    const result = await statsService.getParishDistribution(parsedStartDate, parsedEndDate);
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

    const result = await statsService.getCasesByType(parsedStartDate, parsedEndDate);
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

    const result = await statsService.getBeneficiariesByParish(parsedStartDate, parsedEndDate);
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

    const result = await statsService.getStudentInvolvement(parsedStartDate, parsedEndDate);
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

    const result = await statsService.getCasesByServiceType(parsedStartDate, parsedEndDate);
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

    const result = await statsService.getProfessorInvolvement(parsedStartDate, parsedEndDate);
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

    const result = await statsService.getBeneficiaryTypeDistribution(parsedStartDate, parsedEndDate);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}
