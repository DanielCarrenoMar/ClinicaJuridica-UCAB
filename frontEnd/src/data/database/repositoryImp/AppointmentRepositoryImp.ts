import type { AppointmentRepository } from "#domain/repositories.ts";
import { APPOINTMENT_URL } from "./apiUrl";
import type { AppointmentInfoDAO } from "#database/daos/appointmentInfoDAO.ts";
import { daoToAppointmentModel } from "#domain/models/appointment.ts";
export function getAppointmentRepository(): AppointmentRepository {
    return {
        findAllAppointments: async () => {
            const responseAppointment = await fetch(APPOINTMENT_URL);
            const appointmentData = await responseAppointment.json();
            const appointmentDAOs: AppointmentInfoDAO[] = appointmentData.data;
            return appointmentDAOs.map(daoToAppointmentModel);
        },
        findAppointmentById: async (id: number) => {
            const responseAppointment = await fetch(`${APPOINTMENT_URL}/${id}`);
            if (!responseAppointment.ok) return null;
            const appointmentData = await responseAppointment.json();
            const appointmentDAO: AppointmentInfoDAO = appointmentData.data;
            return daoToAppointmentModel(appointmentDAO);
        },
        createAppointment: async (data) => {
            const response = await fetch(APPOINTMENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Error creating appointment");
            const datas = await response.json();
            const appointmentDAO: AppointmentInfoDAO = datas.data;
            return daoToAppointmentModel(appointmentDAO);
        },
        updateAppointment: async (id, data) => {
            const response = await fetch(`${APPOINTMENT_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            return result.data;
        },
    }
}