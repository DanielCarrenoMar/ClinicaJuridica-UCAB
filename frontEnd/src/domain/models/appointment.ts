import type { AppointmentInfoDAO } from "#database/daos/appointmentInfoDAO.ts";
import type { AppointmentStatusTypeModel } from "#domain/typesModel.ts";
import { typeDaoToAppointmentStatusTypeModel } from "#domain/typesModel.ts";
export interface AppointmentModel {
    idCase: number;
    appointmentNumber: number;
    plannedDate: Date;
    executionDate?: Date;
    status: AppointmentStatusTypeModel;
    guidance?: string;
    userId: string;
    userName: string;
    registryDate: Date;
}


export function daoToAppointmentModel(dao: AppointmentInfoDAO): AppointmentModel {
    const { registryDate, plannedDate, executionDate, status, ...rest } = dao;
    return {
        registryDate: new Date(registryDate),
        plannedDate: new Date(plannedDate),
        executionDate: executionDate ? new Date(executionDate) : undefined,
        status: typeDaoToAppointmentStatusTypeModel(status),
        ...rest
    }
}
