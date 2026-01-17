// @ts-nocheck
import type { Request, Response } from 'express';
import userService from '../services/user.service.js';
import { parsePagination } from '../utils/pagination.util.js';

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const result = await userService.getAllUsers(pagination);
    if (result.error) {
      res.status(500).json({ success: false, error: result.error });
      return;
    }
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await userService.getUserById(id);
    if (!result.success) {
      res.status(404).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    if (!data.identityCard || !data.email || !data.password) {
      res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
      return;
    }
    const result = await userService.createUser(data);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await userService.updateUser(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function changeUserStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const { isActive } = req.body;
    const result = await userService.updateUser(id, { isActive });
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const { password } = req.body;
    const result = await userService.updateUser(id, { password });
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function getUserCases(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await userService.getUserCases(id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await userService.deleteUser(id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}