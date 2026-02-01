import prisma from '#src/config/database.js';
import { AppointmentReqDTO, AppointmentResDTO } from '@app/shared/dtos/AppoimentDTO';
import { PacketDTO } from '@app/shared/dtos/packets/PacketDTO';

class AppointmentService {

  async getAllAppointments(pagination?: { page: number; limit: number; all: boolean }) {
    try {
      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 15;
      const all = pagination?.all ?? false;
      const offset = (page - 1) * limit;

      const totalRows = await prisma.$queryRaw`
        SELECT COUNT(*)::int as total FROM "Appointment"
      `;
      const total = Array.isArray(totalRows) ? Number(totalRows[0]?.total ?? 0) : 0;

      const appointments = all
        ? await prisma.$queryRaw`
          SELECT 
            a.*,
            u."fullName" as "userName"
          FROM "Appointment" a
          JOIN "User" u ON a."userId" = u."identityCard"
          ORDER BY a."plannedDate" DESC
        `
        : await prisma.$queryRaw`
          SELECT 
            a.*,
            u."fullName" as "userName"
          FROM "Appointment" a
          JOIN "User" u ON a."userId" = u."identityCard"
          ORDER BY a."plannedDate" DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

      const totalPages = all ? 1 : Math.max(1, Math.ceil(total / limit));
      return {
        success: true,
        data: appointments,
        pagination: {
          page,
          limit: all ? total : limit,
          total,
          totalPages,
          all
        }
      };
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

  async createAppointment(data: AppointmentReqDTO) : Promise<PacketDTO<AppointmentResDTO>> {
    try {
      const newAppointment = await prisma.appointment.create({
        data: {
          idCase: data.idCase,
          appointmentNumber: data.appointmentNumber,
          plannedDate: data.plannedDate,
          executionDate: data.executionDate || null,
          status: data.status,
          guidance: data.guidance || null,
          userId: data.userId || null,
          registryDate: new Date()
        },
        include: {
          user: {
            select: {
              fullName: true
            }
          }
        }
      });

      if (!newAppointment) {
        throw new Error('Error al crear la cita');
      }

      const result: AppointmentResDTO = {
        idCase: newAppointment.idCase,
        appointmentNumber: newAppointment.appointmentNumber,
        plannedDate: newAppointment.plannedDate.toISOString(),
        executionDate: newAppointment.executionDate?.toISOString(),
        status: newAppointment.status,
        guidance: newAppointment.guidance || undefined,
        userId: newAppointment.userId || undefined,
        registryDate: newAppointment.registryDate.toISOString(),
        userName: newAppointment.user?.fullName || undefined
      };

      return { success: true, data: result };
    } catch (error: any) {
      console.error(error)
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
