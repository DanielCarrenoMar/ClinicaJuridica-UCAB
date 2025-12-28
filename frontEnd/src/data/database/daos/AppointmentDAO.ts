import type { AppointmentStatusDAO } from "./typesDAO.ts";

export interface AppointmentDAO {
  idCase: number;
  appointmentNumber: number;
  plannedDate: Date;
  executionDate?: Date;
  status: AppointmentStatusDAO;
  guidance?: string;
  userId: string;
  registryDate: Date;
}
