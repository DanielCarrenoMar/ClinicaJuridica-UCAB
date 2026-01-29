import type { AppointmentStatusTypeDTO } from "@app/shared/typesDTO";

export interface AppointmentDAO {
    idCase: number;
    appointmentNumber: number;
    plannedDate?: string;
    executionDate?: string;
    status: AppointmentStatusTypeDTO;
    guidance?: string;
    userId: string;
    registryDate: string;
}