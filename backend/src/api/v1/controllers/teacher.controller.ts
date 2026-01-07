import type { Request, Response } from 'express';
import teacherService from '../services/teacher.service.js';

export async function getAllTeachers(req: Request, res: Response): Promise<void> {
  try {
    const term = typeof req.query.term === 'string' ? req.query.term : undefined;
    const result = await teacherService.getAllTeachers(term);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getTeacherById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const term = typeof req.query.term === 'string' ? req.query.term : undefined;

    const result = await teacherService.getTeacherById(id, term);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getCasesByTeacherId(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const result = await teacherService.getCasesByTeacherId(id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
