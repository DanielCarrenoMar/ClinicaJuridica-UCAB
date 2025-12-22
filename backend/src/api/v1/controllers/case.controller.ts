// Importar tipos correctamente
import type { Request, Response } from 'express';
import caseService from '../services/case.service.js';

// Obtener todos los casos
export const getAllCases = async (req: Request, res: Response) => {
  try {
    const result = await caseService.getAllCases();
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un caso por ID
export const getCaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const caseId = parseInt(id);

    if (isNaN(caseId)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const result = await caseService.getCaseById(caseId);
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear un nuevo caso
export const createCase = async (req: Request, res: Response) => {
  try {
    const caseData = req.body;

    // Validaciones básicas
    if (!caseData.description || !caseData.idLegalArea || !caseData.idApplicant) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: description, idLegalArea, idApplicant'
      });
    }

    const result = await caseService.createCase(caseData);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};