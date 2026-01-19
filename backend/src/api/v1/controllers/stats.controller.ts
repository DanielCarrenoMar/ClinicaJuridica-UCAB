import type { Request, Response } from 'express';
import statsService from '../services/stats.service.js';

export async function getQuantityByType(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getQuantityByType(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getQuantityByStatus(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getQuantityByStatus(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getQuantityByParish(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getQuantityByParish(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getQuantityByPeriod(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getQuantityByPeriod(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getQuantityBySubject(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getQuantityBySubject(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getQuantityBySubjectScope(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getQuantityBySubjectScope(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getApplicantsByGender(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getApplicantsByGender(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getApplicantsByState(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getApplicantsByState(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getApplicantsByParish(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getApplicantsByParish(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getBeneficiaryTypeCount(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getBeneficiaryTypeCount(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getBeneficiariesByParish(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getBeneficiariesByParish(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getStudentsByType(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getStudentsByType(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getTeachersByType(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await statsService.getTeachersByType(
      startDate as string,
      endDate as string
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}
