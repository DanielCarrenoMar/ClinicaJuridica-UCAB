import type { AppointmentRepository } from "#domain/repositories.ts";
import { APPOINTMENT_URL } from "./apiUrl";
import type { AppointmentInfoDAO } from "#database/daos/appointmentInfoDAO.ts";
import { daoToAppointmentModel } from "#domain/models/appointment.ts";
export function getAppointmentRepository(): AppointmentRepository {
    return {
        findAllAppointments: async (params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString() ? `${APPOINTMENT_URL}?${query.toString()}` : APPOINTMENT_URL;
            const responseAppointment = await fetch(url, { method: 'GET', credentials: 'include' });
            const appointmentData = await responseAppointment.json();
            if (!responseAppointment.ok) throw new Error(appointmentData.message || 'Error fetching appointments');
            const appointmentDAOs: AppointmentInfoDAO[] = appointmentData.data;
            return appointmentDAOs.map(daoToAppointmentModel);
        },
        findAppointmentById: async (id: number) => {
            const responseAppointment = await fetch(`${APPOINTMENT_URL}/${id}`, { method: 'GET', credentials: 'include' });
            const appointmentData = await responseAppointment.json();
            if (!responseAppointment.ok) throw new Error(appointmentData.message || 'Error fetching appointment');
            const appointmentDAO: AppointmentInfoDAO = appointmentData.data;
            return daoToAppointmentModel(appointmentDAO);
        },
        createAppointment: async (data) => {
            const response = await fetch(APPOINTMENT_URL, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const datas = await response.json();
            if (!response.ok) throw new Error(datas.message || "Error creating appointment");
            const appointmentDAO: AppointmentInfoDAO = datas.data;
            return daoToAppointmentModel(appointmentDAO);
        },
        updateAppointment: async (id, data) => {
            const response = await fetch(`${APPOINTMENT_URL}/${id}`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error updating appointment');
            return result.data;
        },
        deleteAppointment: async (idCase, appointmentNumber) => {
            const response = await fetch(`${APPOINTMENT_URL}/${idCase}/${appointmentNumber}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.message || 'Error deleting appointment');
        },
    }
}