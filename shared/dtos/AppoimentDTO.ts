import type { AppointmentStatusTypeDTO } from "@app/shared/typesDTO";

export interface AppointmentReqDTO {
    idCase: number;
    appointmentNumber: number;
    plannedDate: string;
    executionDate?: string;
    status: AppointmentStatusTypeDTO;
    guidance?: string;
    userId?: string;
    registryDate: string;
}

export interface AppointmentResDTO extends AppointmentReqDTO {
    userName?: string;
}