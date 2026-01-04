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
    const { registryDate, status, ...rest } = dao;
    return {
        registryDate: new Date(registryDate),
        status: typeDaoToAppointmentStatusTypeModel(status),
        ...rest
    }
}
