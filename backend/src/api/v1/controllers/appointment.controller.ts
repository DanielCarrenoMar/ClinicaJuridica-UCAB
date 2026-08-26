import type { Request, Response } from 'express';
import appointmentService from '../services/appointment.service.js';
import { parsePagination } from '../utils/pagination.util.js';
import { validateRequiredParams } from '../utils/checkParameters.util.js';
import { AppointmentReqDTO } from '@app/shared/dtos/AppoimentDTO';

export async function getAllAppointments(req: Request, res: Response): Promise<void> {
    try {
        const pagination = parsePagination(req.query as Record<string, unknown>);
        const result = await appointmentService.getAllAppointments(pagination);

        if (!result.success) {
            res.status(500).json(result);
            return;
        }

        res.status(200).json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al obtener citas';
        res.status(500).json({ success: false, error: msg });
    }
}

export async function getAppointmentById(req: Request, res: Response): Promise<void> {
    try {
        const { id, appointmentNumber } = req.params;
        const idCase = parseInt(id);
        const apptNumber = parseInt(appointmentNumber);

        if (isNaN(idCase) || isNaN(apptNumber)) {
            res.status(400).json({ success: false, message: 'ID de caso o número de cita inválido' });
            return;
        }

        const result = await appointmentService.getAppointmentById(idCase, apptNumber);

        if (!result.success) {
            res.status(404).json(result);
            return;
        }

        res.status(200).json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al buscar cita';
        res.status(500).json({ success: false, error: msg });
    }
}

export async function createAppointment(req: Request, res: Response): Promise<void> {
    try {
        const data: AppointmentReqDTO = req.body;
        const errorMsg = validateRequiredParams<AppointmentReqDTO>(data, ['idCase', 'plannedDate', 'status']);
        if (errorMsg) {
            res.status(400).json({
            success: false,
            message: errorMsg
            });
            return;
        }

        if (isNaN(Date.parse(data.plannedDate))) {
            res.status(400).json({
                success: false,
                message: 'La fecha planificada no es una fecha válida.'
            });
            return;
        }

        if (data.executionDate && isNaN(Date.parse(data.executionDate))) {
            res.status(400).json({
                success: false,
                message: 'La fecha de ejecución no es una fecha válida.'
            });
            return;
        }

        const result = await appointmentService.createAppointment(data);

        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(201).json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al crear cita';
        res.status(500).json({ success: false, error: msg });
    }
}

export async function updateAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params; // Using 'id' as 'idCase' based on current frontend implementation
        const data = req.body;

        // We need appointmentNumber to identify the specific appointment within the case
        // It should be passed in the body since the URL only handles one ID currently
        if (!data.appointmentNumber) {
            res.status(400).json({ success: false, message: 'Se requiere appointmentNumber en el cuerpo de la solicitud para identificar la cita.' });
            return;
        }

        const idCase = parseInt(id);
        const appointmentNumber = data.appointmentNumber;

        const result = await appointmentService.updateAppointment(idCase, appointmentNumber, data);

        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(200).json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al actualizar';
        res.status(500).json({ success: false, error: msg });
    }
}

export async function deleteAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id, appointmentNumber } = req.params;
        const result = await appointmentService.deleteAppointment(parseInt(id), parseInt(appointmentNumber));
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al eliminar';
        res.status(500).json({ success: false, error: msg });
    }
}
