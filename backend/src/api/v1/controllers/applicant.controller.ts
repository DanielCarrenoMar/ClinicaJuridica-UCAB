import type { Request, Response } from 'express';
import applicantService from '../services/applicant.service.js';

// Obtener todos los solicitantes
export const getAllApplicants = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await applicantService.getAllApplicants();
    res.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: errorMessage
    });
  }
};

// Obtener un solicitante por ID
export const getApplicantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'ID no proporcionado'
      });
      return;
    }
    
    const applicantId = parseInt(id);

    if (isNaN(applicantId)) {
      res.status(400).json({
        success: false,
        message: 'ID debe ser un número'
      });
      return;
    }

    const result = await applicantService.getApplicantById(applicantId);
    
    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: errorMessage
    });
  }
};

// Buscar solicitantes
export const searchApplicants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Término de búsqueda requerido'
      });
      return;
    }

    const result = await applicantService.searchApplicants(q);
    res.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: errorMessage
    });
  }
};

// Crear un nuevo solicitante
export const createApplicant = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicantData = req.body;

    // Validaciones básicas
    if (!applicantData.firstName || !applicantData.lastName || !applicantData.email) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: firstName, lastName, email'
      });
      return;
    }

    const result = await applicantService.createApplicant(applicantData);
    
    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: errorMessage
    });
  }
};

// Actualizar un solicitante
export const updateApplicant = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const applicantId = parseInt(id);
    
    if (isNaN(applicantId)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
      return;
    }

    const applicantData = req.body;
    const result = await applicantService.updateApplicant(applicantId, applicantData);
    
    res.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: errorMessage
    });
  }
};

// Eliminar un solicitante
export const deleteApplicant = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const applicantId = parseInt(id);
    
    if (isNaN(applicantId)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
      return;
    }

    const result = await applicantService.deleteApplicant(applicantId);
    res.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: errorMessage
    });
  }
};

// Obtener casos de un solicitante
export const getApplicantCases = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const applicantId = parseInt(id);
    
    if (isNaN(applicantId)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
      return;
    }

    const result = await applicantService.getApplicantCases(applicantId);
    res.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: errorMessage
    });
  }
};