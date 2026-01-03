import type { AppointmentStatusTypeDAO } from "#database/typesDAO.ts";

export interface AppointmentDAO {
    idCase: number;
    appointmentNumber: number;
    plannedDate: Date;
    executionDate?: Date;
    status: AppointmentStatusTypeDAO;
    guidance?: string;
    userId: string;
    registryDate: Date;
}