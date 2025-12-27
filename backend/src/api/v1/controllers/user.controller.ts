import type { Request, Response } from 'express';
import userService from '../services/user.service.js';

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id || id.trim() === '') {
      res.status(400).json({ success: false, message: 'ID inválido (Cédula requerida)' });
      return;
    }

    const result = await userService.getUserById(id);
    
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

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const userData = req.body;

    if (!userData.identityCard || !userData.name || !userData.email || !userData.userType) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: identityCard, name, email, userType'
      });
      return;
    }

    const result = await userService.createUser(userData);
    
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

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: 'ID requerido' });
      return;
    }

    const result = await userService.updateUser(id, req.body);
    
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

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: 'ID requerido' });
      return;
    }

    const result = await userService.deleteUser(id);
    
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