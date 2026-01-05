import type { Request, Response } from 'express';
import studentService from '../services/student.service.js';

export async function getAllStudents(req: Request, res: Response): Promise<void> {
  try {
    const term = typeof req.query.term === 'string' ? req.query.term : undefined;
    const result = await studentService.getAllStudents(term);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getStudentById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const term = typeof req.query.term === 'string' ? req.query.term : undefined;

    const result = await studentService.getStudentById(id, term);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
