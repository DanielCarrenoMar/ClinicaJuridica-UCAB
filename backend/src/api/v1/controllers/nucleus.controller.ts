// @ts-nocheck
import type { Request, Response } from 'express';
import nucleusService from '../services/nucleus.service.js';

export async function getAllNuclei(req: Request, res: Response): Promise<void> {
    try {
        const result = await nucleusService.getAllNuclei();
        res.status(result.success ? 200 : 400).json(result);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ success: false, error: errorMessage });
    }
}

export async function createNucleus(req: Request, res: Response): Promise<void> {
    try {
        const { idNucleus, idState, municipalityNumber, parishNumber } = req.body;

        if (!idNucleus || idState === undefined || municipalityNumber === undefined || parishNumber === undefined) {
            res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: idNucleus, idState, municipalityNumber, parishNumber'
            });
            return;
        }

        const result = await nucleusService.createNucleus(req.body);
        res.status(result.success ? 201 : 400).json(result);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ success: false, error: errorMessage });
    }
}

export async function deleteNucleus(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await nucleusService.deleteNucleus(id);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ success: false, error: errorMessage });
    }
}
