import type { Request, Response } from 'express';
import caseActionService from '../services/caseAction.service.js';
import { parsePagination } from '../utils/pagination.util.js';

export async function getAllCaseActions(req: Request, res: Response): Promise<void> {
  try {
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const result = await caseActionService.getAllCaseActions(pagination);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getCaseActionsByUserId(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const result = await caseActionService.getCaseActionsByUserId(userId, pagination);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function createCaseAction(req: Request, res: Response): Promise<void> {
  try {
    const result = await caseActionService.createCaseAction(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
