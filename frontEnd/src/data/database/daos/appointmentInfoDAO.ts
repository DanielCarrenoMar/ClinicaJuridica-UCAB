import type { AppointmentDAO } from "./appointmentDAO.ts";

export interface AppointmentInfoDAO extends AppointmentDAO {
    userName: string;
    caseCompoundKey: string;
}
