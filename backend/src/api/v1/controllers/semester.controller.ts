// @ts-nocheck
import type { Request, Response } from 'express';
import semesterService from '../services/semester.service.js';

export async function getAllSemesters(req: Request, res: Response): Promise<void> {
  try {
    const result = await semesterService.getAllSemesters();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getCurrentSemester(req: Request, res: Response): Promise<void> {
  try {
    const result = await semesterService.getCurrentSemester();
    
    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getSemesterById(req: Request, res: Response): Promise<void> {
  try {
    const { term } = req.params;
    const result = await semesterService.getSemesterById(term);
    
    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function createSemester(req: Request, res: Response): Promise<void> {
  try {
    const { term, startDate, endDate } = req.body;

    if (!term || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: term, startDate, endDate'
      });
      return;
    }

    // Validar formato de fechas
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Las fechas proporcionadas no son válidas'
      });
      return;
    }

    if (start >= end) {
      res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
      return;
    }

    const result = await semesterService.createSemester({
      term,
      startDate: start,
      endDate: end
    });

    res.status(result.success ? 201 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function updateSemester(req: Request, res: Response): Promise<void> {
  try {
    const { term } = req.params;
    const { startDate, endDate } = req.body;

    const updateData: { startDate?: Date; endDate?: Date } = {};

    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        res.status(400).json({
          success: false,
          message: 'La fecha de inicio proporcionada no es válida'
        });
        return;
      }
      updateData.startDate = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        res.status(400).json({
          success: false,
          message: 'La fecha de fin proporcionada no es válida'
        });
        return;
      }
      updateData.endDate = end;
    }

    // Validar que startDate < endDate si ambas están presentes
    if (updateData.startDate && updateData.endDate && updateData.startDate >= updateData.endDate) {
      res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
      return;
    }

    const result = await semesterService.updateSemester(term, updateData);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function deleteSemester(req: Request, res: Response): Promise<void> {
  try {
    const { term } = req.params;
    const result = await semesterService.deleteSemester(term);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}
