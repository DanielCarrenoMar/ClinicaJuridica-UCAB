import type { Request, Response } from 'express';
import appointmentService from '../services/appointment.service.js';

export async function getAllAppointments(req: Request, res: Response): Promise<void> {
    try {
        const result = await appointmentService.getAllAppointments();

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
        const { id } = req.params;
        // Assuming the ID passed is just 'appointmentNumber' is risky without caseId. 
        // However, trying to fit the typical REST pattern where ID is unique.
        // Given the constraints, if the frontend sends a composite ID like "caseId-apptNum", we could parse it.
        // Or if the user just wants to fetch by AppointmentNumber assuming they know the context?
        // Let's try to parse "idCase-appointmentNumber" if possible, or just expect two params in a different route?
        // For now, based on "getAppointmentById(id: number)" in the frontend, it seems impossible with composite key.
        // I will implement a check. If it's a number, maybe fail or try to search?
        // Actually, I will implement it such that it expects idCase if query param exists?

        // Simplest approach: The user code sends `${APPOINTMENT_URL}/${id}`.
        // If 'id' is sent, we need to know what it is. 
        // I will assume for now that logic might be flawed in the frontend or I serve All for that case?
        // Let's just implement a placeholder or try to parse.

        // Better yet, I'll implement getAppointmentsByCaseId if the route allows filtering.
        // But sticking to strict "get by id":
        // I will assume the ID passed is just the "idCase" to get all appointments?
        // No, that's "findAll".

        res.status(501).json({ success: false, message: 'Fetching by single ID not fully supported for composite key Appointments without structured ID.' });

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Error desconocido al buscar cita';
        res.status(500).json({ success: false, error: msg });
    }
}

export async function createAppointment(req: Request, res: Response): Promise<void> {
    try {
        const data = req.body;

        // Validate required fields
        if (!data.idCase || !data.plannedDate || !data.userId || !data.status) {
            res.status(400).json({ success: false, message: 'Faltan campos requeridos (idCase, plannedDate, userId, status).' });
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
