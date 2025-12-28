type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export interface AppointmentModel {
    idCase: number;
    caseCompoundKey: string;
    appointmentNumber: number;
    plannedDate: Date;
    executionDate?: Date;
    status: AppointmentStatus;
    guidance?: string;
    userId: string;
    userName: string;
    registryDate: Date;
}