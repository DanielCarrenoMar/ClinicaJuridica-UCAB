import type { Request, Response } from 'express';
import configService from '../services/config.service.js';

export async function getAllInitialData(req: Request, res: Response): Promise<void> {
  try {
    const [semesters, locations, legalStructure, applicantMeta, housing, nuclei] = await Promise.all([
      configService.getSemesters(),
      configService.getLocations(),
      configService.getLegalStructure(),
      configService.getApplicantMetadata(),
      configService.getHousingCharacteristics(),
      configService.getNuclei()
    ]);

    res.status(200).json({
      success: true,
      data: {
        semesters,
        locations,
        legalStructure,
        applicantMeta,
        housing,
        nuclei
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos de configuración",
      error: errorMessage
    });
  }
}

export async function createSemester(req: Request, res: Response): Promise<void> {
  try {
    const semester = await configService.createSemester(req.body);
    res.status(201).json({
      success: true,
      message: "Semestre creado exitosamente",
      data: semester
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(400).json({
      success: false,
      message: "Error al crear el semestre",
      error: errorMessage
    });
  }
}

export async function getLegalStructure(req: Request, res: Response): Promise<void> {
  try {
    const structure = await configService.getLegalStructure();
    res.status(200).json({
      success: true,
      data: structure
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}

export async function getLocations(req: Request, res: Response): Promise<void> {
  try {
    const locations = await configService.getLocations();
    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}