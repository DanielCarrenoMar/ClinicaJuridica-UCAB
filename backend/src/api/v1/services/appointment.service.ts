import prisma from '#src/config/database.js';

class AppointmentService {

    async getAllAppointments() {
        try {
            const appointments = await prisma.$queryRaw`
        SELECT 
          a.*,
          u."fullName" as "userName"
        FROM "Appointment" a
        JOIN "User" u ON a."userId" = u."identityCard"
        ORDER BY a."plannedDate" DESC
      `;
            return { success: true, data: appointments };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    async getAppointmentById(idCase: number, appointmentNumber: number) {
        try {
            const appointment = await prisma.$queryRaw`
        SELECT 
          a.*,
          u."fullName" as "userName"
        FROM "Appointment" a
        JOIN "User" u ON a."userId" = u."identityCard"
        WHERE a."idCase" = ${idCase} AND a."appointmentNumber" = ${appointmentNumber}
        LIMIT 1
      `;

            if (!Array.isArray(appointment) || appointment.length === 0) {
                return { success: false, message: 'Cita no encontrada' };
            }

            return { success: true, data: appointment[0] };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    async createAppointment(data: any) {
        try {
            const result = await prisma.$transaction(async (tx) => {
                // Calculate next appointment number if not provided
                if (!data.appointmentNumber) {
                    const maxAppt = await tx.$queryRaw<{ client_max: number }[]>`
            SELECT MAX("appointmentNumber") as client_max
            FROM "Appointment"
            WHERE "idCase" = ${data.idCase}
          `;
                    const currentMax = maxAppt[0]?.client_max ?? 0;
                    data.appointmentNumber = currentMax + 1;
                }

                await tx.$executeRaw`
          INSERT INTO "Appointment" (
            "idCase", "appointmentNumber", "plannedDate", "executionDate", 
            "status", "guidance", "userId", "registryDate"
          ) VALUES (
            ${data.idCase}, ${data.appointmentNumber}, CAST(${data.plannedDate} AS DATE), 
            ${data.executionDate ? data.executionDate : null}, 
            ${data.status}, ${data.guidance}, ${data.userId}, ${new Date()}
          )
        `;

                const newAppointment = await tx.$queryRaw`
          SELECT 
            a.*,
            u."fullName" as "userName"
          FROM "Appointment" a
          JOIN "User" u ON a."userId" = u."identityCard"
          WHERE a."idCase" = ${data.idCase} AND a."appointmentNumber" = ${data.appointmentNumber}
          LIMIT 1
        `;

                // If returned array is empty, something went wrong
                if (!Array.isArray(newAppointment) || newAppointment.length === 0) {
                    throw new Error("Failed to retrieve created appointment");
                }
                return newAppointment[0];
            });

            return { success: true, data: result };
        } catch (error: any) {
            console.log(error)
            return { success: false, error: error.message };
        }
    }

    async updateAppointment(idCase: number, appointmentNumber: number, data: any) {
        try {
            await prisma.$executeRaw`
        UPDATE "Appointment"
        SET 
          "plannedDate" = COALESCE(CAST(${data.plannedDate} AS DATE), "plannedDate"),
          "executionDate" = COALESCE(CAST(${data.executionDate} AS DATE), "executionDate"),
          "status" = COALESCE(${data.status}, "status"),
          "guidance" = COALESCE(${data.guidance}, "guidance"),
          "userId" = COALESCE(${data.userId}, "userId")
        WHERE "idCase" = ${idCase} AND "appointmentNumber" = ${appointmentNumber}
      `;

            const updated = await prisma.$queryRaw`
        SELECT 
          a.*,
          u."fullName" as "userName"
        FROM "Appointment" a
        JOIN "User" u ON a."userId" = u."identityCard"
        WHERE a."idCase" = ${idCase} AND a."appointmentNumber" = ${appointmentNumber}
        LIMIT 1
      `;

            if (!Array.isArray(updated) || updated.length === 0) {
                return { success: false, message: 'Error al actualizar cita' };
            }

            return { success: true, data: updated[0] };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
}

export default new AppointmentService();
