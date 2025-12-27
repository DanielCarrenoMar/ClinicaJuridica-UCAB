import type { Request, Response } from 'express';
import userService from '../services/user.service.js';

// Obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un usuario por ID (Cédula)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!id || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser una cédula válida.'
      });
    }

    const result = await userService.getUserById(id);
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    // Validaciones básicas
    if (!userData.identityCard || !userData.name || !userData.email || !userData.type) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: identityCard, name, email, type'
      });
    }

    const result = await userService.createUser(userData);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const userData = req.body;

    if (!id || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser una cédula válida.'
      });
    }

    const result = await userService.updateUser(id, userData);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!id || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser una cédula válida.'
      });
    }

    const result = await userService.deleteUser(id);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Seed: Poblar la base de datos con usuarios de prueba
export const seedUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.seedInitialUsers();
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};