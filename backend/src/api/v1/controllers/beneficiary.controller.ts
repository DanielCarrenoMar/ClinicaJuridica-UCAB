import type { Request, Response } from 'express';
import beneficiaryService from '../services/beneficiary.service.js';
import { parsePagination } from '../utils/pagination.util.js';

export async function getAllBeneficiaries(req: Request, res: Response): Promise<void> {
  try {
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const result = await beneficiaryService.getAll(pagination);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getBeneficiaryById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await beneficiaryService.getById(id);
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

export async function createBeneficiary(req: Request, res: Response): Promise<void> {
  try {
    const result = await beneficiaryService.create(req.body);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(201).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function updateBeneficiary(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await beneficiaryService.update(id, req.body);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function deleteBeneficiary(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await beneficiaryService.delete(id);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getBeneficiaryCases(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await beneficiaryService.getCases(id);
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}