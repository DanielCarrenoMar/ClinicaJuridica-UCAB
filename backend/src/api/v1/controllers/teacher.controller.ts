import type { Request, Response } from 'express';
import teacherService from '../services/teacher.service.js';
import { parsePagination } from '../utils/pagination.util.js';

export async function getAllTeachers(req: Request, res: Response): Promise<void> {
  try {
    const term = typeof req.query.term === 'string' ? req.query.term : undefined;
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const result = await teacherService.getAllTeachers(term, pagination);
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

export async function updateTeacher(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await teacherService.updateTeacher(id, data);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
export async function createTeacher(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    if (!data.identityCard || !data.password) {
      res.status(400).json({ success: false, message: 'Faltan campos requeridos (cedula, contraseña)' });
      return;
    }
    const result = await teacherService.createTeacher(data);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
