import type { AppointmentStatusTypeDAO } from "#database/typesDAO.ts";

export interface AppointmentDAO {
    idCase: number;
    appointmentNumber: number;
    plannedDate?: string;
    executionDate?: string;
    status: AppointmentStatusTypeDAO;
    guidance?: string;
    userId: string;
    registryDate: string;
}