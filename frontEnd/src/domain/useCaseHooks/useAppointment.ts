import { getAppointmentRepository } from "#database/repositoryImp/AppointmentRepositoryImp.ts";
import { useState, useEffect, useCallback } from "react";
import type { AppointmentModel } from "#domain/models/appointment.ts";
import type { AppointmentDAO } from "#database/daos/appointmentDAO.ts";
export function findAllAppointments() {
    const { findAllAppointments } = getAppointmentRepository();
    const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await findAllAppointments();
            setAppointments(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);

    return {
        appointments,
        loading,
        error,
        refresh: loadAppointments
    };
}

export function findAppointmentById(id: number) {
    const { findAppointmentById } = getAppointmentRepository();
    const [appointment, setAppointment] = useState<AppointmentModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadAppointment = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const data = await findAppointmentById(id);
            setAppointment(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAppointment(id);
    }, [id, loadAppointment]);

    return {
        appointment,
        loading,
        error,
        loadAppointment
    };
}

export function createAppointment() {
    const { createAppointment } = getAppointmentRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createAppointmentData = useCallback(async (appointmentData: AppointmentDAO) => {
        setLoading(true);
        try {
            const newAppointment = await createAppointment(appointmentData);
            setError(null);
            return newAppointment;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createAppointment: createAppointmentData,
        loading,
        error
    };
}

export function updateAppointment() {
    const { updateAppointment } = getAppointmentRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateAppointmentData = useCallback(async (id: number, appointmentData: Partial<AppointmentModel>) => {
        setLoading(true);
        try {
            const updatedAppointment = await updateAppointment(id, appointmentData);
            setError(null);
            return updatedAppointment;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        updateAppointment: updateAppointmentData,
        loading,
        error
    };
}