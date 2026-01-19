import type { Request, Response } from 'express';
import studentService from '../services/student.service.js';
import fileParserUtil from '../utils/fileParser.util.js';
import { parsePagination } from '../utils/pagination.util.js';

export async function getAllStudents(req: Request, res: Response): Promise<void> {
  try {
    const term = typeof req.query.term === 'string' ? req.query.term : undefined;
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const result = await studentService.getAllStudents(term, pagination);
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

export async function getCasesByStudentId(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const result = await studentService.getCasesByStudentId(id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function updateStudent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await studentService.updateStudent(id, data);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function importStudents(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No se ha subido ningún archivo.' });
      return;
    }

    const studentsData = fileParserUtil.parseStudentFile(req.file.buffer);

    if (studentsData.length === 0) {
      res.status(400).json({ success: false, message: 'El archivo está vacío o no tiene el formato correcto.' });
      return;
    }

    const result = await studentService.importStudents(studentsData);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
export async function createStudent(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    if (!data.identityCard || !data.password) {
      res.status(400).json({ success: false, message: 'Faltan campos requeridos (cedula, contraseña)' });
      return;
    }
    const result = await studentService.createStudent(data);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
