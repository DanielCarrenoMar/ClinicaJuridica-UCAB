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

        let status = data.status;
        if (data.executionDate && (!data.plannedDate || data.plannedDate === '' || data.plannedDate === null)) {
          status = 'R';
        }

        await tx.$executeRaw`
          INSERT INTO "Appointment" (
            "idCase", "appointmentNumber", "plannedDate", "executionDate", 
            "status", "guidance", "userId", "registryDate"
          ) VALUES (
            ${data.idCase}, ${data.appointmentNumber}, CAST(${data.plannedDate} AS DATE), 
            ${data.executionDate ? data.executionDate : null}, 
            ${status}, ${data.guidance}, ${data.userId}, ${new Date()}
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
      // Validar y preparar las fechas: solo hacer CAST si no son cadenas vacías o null
      // Si es cadena vacía, no actualizar el campo (mantener el valor actual)
      const hasPlannedDate = data.plannedDate && typeof data.plannedDate === 'string' && data.plannedDate.trim() !== '';
      const hasExecutionDate = data.executionDate !== undefined;
      const executionDateIsEmpty = data.executionDate === null || data.executionDate === '' || (typeof data.executionDate === 'string' && data.executionDate.trim() === '');

      if (hasPlannedDate) {
        // Si hay plannedDate válido, actualizar con CAST
        if (hasExecutionDate) {
          if (executionDateIsEmpty) {
            await prisma.$executeRaw`
              UPDATE "Appointment"
              SET 
                "plannedDate" = CAST(${data.plannedDate} AS DATE),
                "executionDate" = NULL,
                "status" = COALESCE(${data.status}, "status"),
                "guidance" = COALESCE(${data.guidance}, "guidance"),
                "userId" = COALESCE(${data.userId}, "userId")
              WHERE "idCase" = ${idCase} AND "appointmentNumber" = ${appointmentNumber}
            `;
          } else {
            await prisma.$executeRaw`
              UPDATE "Appointment"
              SET 
                "plannedDate" = CAST(${data.plannedDate} AS DATE),
                "executionDate" = CAST(${data.executionDate} AS DATE),
                "status" = COALESCE(${data.status}, "status"),
                "guidance" = COALESCE(${data.guidance}, "guidance"),
                "userId" = COALESCE(${data.userId}, "userId")
              WHERE "idCase" = ${idCase} AND "appointmentNumber" = ${appointmentNumber}
            `;
          }
        } else {
          await prisma.$executeRaw`
            UPDATE "Appointment"
            SET 
              "plannedDate" = CAST(${data.plannedDate} AS DATE),
              "status" = COALESCE(${data.status}, "status"),
              "guidance" = COALESCE(${data.guidance}, "guidance"),
              "userId" = COALESCE(${data.userId}, "userId")
            WHERE "idCase" = ${idCase} AND "appointmentNumber" = ${appointmentNumber}
          `;
        }
      } else if (hasExecutionDate) {
        // Si no hay plannedDate pero sí executionDate
        if (executionDateIsEmpty) {
          await prisma.$executeRaw`
            UPDATE "Appointment"
            SET 
              "executionDate" = NULL,
              "status" = COALESCE(${data.status}, "status"),
              "guidance" = COALESCE(${data.guidance}, "guidance"),
              "userId" = COALESCE(${data.userId}, "userId")
            WHERE "idCase" = ${idCase} AND "appointmentNumber" = ${appointmentNumber}
          `;
        } else {
          await prisma.$executeRaw`
            UPDATE "Appointment"
            SET 
              "executionDate" = CAST(${data.executionDate} AS DATE),
              "status" = COALESCE(${data.status}, "status"),
              "guidance" = COALESCE(${data.guidance}, "guidance"),
              "userId" = COALESCE(${data.userId}, "userId")
            WHERE "idCase" = ${idCase} AND "appointmentNumber" = ${appointmentNumber}
          `;
        }
      } else {
        // Solo actualizar otros campos
        await prisma.$executeRaw`
          UPDATE "Appointment"
          SET 
            "status" = COALESCE(${data.status}, "status"),
            "guidance" = COALESCE(${data.guidance}, "guidance"),
            "userId" = COALESCE(${data.userId}, "userId")
          WHERE "idCase" = ${idCase} AND "appointmentNumber" = ${appointmentNumber}
        `;
      }

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

  async deleteAppointment(idCase: number, appointmentNumber: number) {
    try {
      await prisma.$executeRaw`
        DELETE FROM "Appointment"
        WHERE "idCase" = ${idCase} AND "appointmentNumber" = ${appointmentNumber}
      `;
      return { success: true, message: 'Cita eliminada exitosamente' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new AppointmentService();
