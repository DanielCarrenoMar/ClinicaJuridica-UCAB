// @ts-nocheck
import prisma from '#src/config/database.js';

class SemesterService {
  async getAllSemesters() {
    try {
      const semesters = await prisma.$queryRaw`
        SELECT 
          s.*,
          COALESCE(case_counts."caseCount", 0)::int as "caseCount",
          COALESCE(teacher_counts."teacherCount", 0)::int as "teacherCount",
          COALESCE(student_counts."studentCount", 0)::int as "studentCount"
        FROM "Semester" s
        LEFT JOIN (
          SELECT "term", COUNT(*)::int as "caseCount"
          FROM "Case"
          GROUP BY "term"
        ) case_counts ON s."term" = case_counts."term"
        LEFT JOIN (
          SELECT "term", COUNT(*)::int as "teacherCount"
          FROM "Teacher"
          GROUP BY "term"
        ) teacher_counts ON s."term" = teacher_counts."term"
        LEFT JOIN (
          SELECT "term", COUNT(*)::int as "studentCount"
          FROM "Student"
          GROUP BY "term"
        ) student_counts ON s."term" = student_counts."term"
        ORDER BY s."startDate" DESC
      `;
      return {
        success: true,
        data: semesters
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCurrentSemester() {
    try {
      const currentSemester = await prisma.$queryRaw`
        SELECT * FROM "Semester" ORDER BY "startDate" DESC LIMIT 1
      `;

      if (!Array.isArray(currentSemester) || currentSemester.length === 0) {
        return { success: false, message: 'No hay semestre actual configurado' };
      }

      return {
        success: true,
        data: currentSemester[0]
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSemesterById(term: string) {
    try {
      const semester = await prisma.$queryRaw`
        SELECT * FROM "Semester" WHERE "term" = ${term}
      `;

      if (!Array.isArray(semester) || semester.length === 0) {
        return { success: false, message: 'Semestre no encontrado' };
      }

      return {
        success: true,
        data: semester[0]
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createSemester(data: { term: string; startDate: Date; endDate: Date }) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Validar que no exista un semestre con el mismo término
        const existingSemester = await tx.$queryRaw`
          SELECT "term" FROM "Semester" WHERE "term" = ${data.term}
        `;

        if (Array.isArray(existingSemester) && existingSemester.length > 0) {
          return { success: false, message: 'Ya existe un semestre con este término' };
        }

        // Eliminar todas las asignaciones de estudiantes a casos
        await tx.$executeRaw`
          DELETE FROM "AssignedStudent"
        `;

        // Crear el nuevo semestre
        const newSemester = await tx.$queryRaw`
          INSERT INTO "Semester" ("term", "startDate", "endDate")
          VALUES (${data.term}, ${data.startDate}, ${data.endDate})
          RETURNING *
        `;

        return {
          success: true,
          data: newSemester[0],
          message: 'Semestre creado correctamente. Se eliminaron todas las asignaciones de estudiantes a casos.'
        };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateSemester(term: string, data: { startDate?: Date; endDate?: Date }) {
    try {
      if (data.startDate === undefined && data.endDate === undefined) {
        return { success: false, message: 'No hay campos para actualizar' };
      }

      let updatedSemester;

      if (data.startDate !== undefined && data.endDate !== undefined) {
        updatedSemester = await prisma.$queryRaw`
          UPDATE "Semester" 
          SET "startDate" = ${data.startDate}, "endDate" = ${data.endDate}
          WHERE "term" = ${term}
          RETURNING *
        `;
      } else if (data.startDate !== undefined) {
        updatedSemester = await prisma.$queryRaw`
          UPDATE "Semester" 
          SET "startDate" = ${data.startDate}
          WHERE "term" = ${term}
          RETURNING *
        `;
      } else {
        updatedSemester = await prisma.$queryRaw`
          UPDATE "Semester" 
          SET "endDate" = ${data.endDate}
          WHERE "term" = ${term}
          RETURNING *
        `;
      }

      if (!Array.isArray(updatedSemester) || updatedSemester.length === 0) {
        return { success: false, message: 'Semestre no encontrado' };
      }

      return {
        success: true,
        data: updatedSemester[0]
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteSemester(term: string) {
    try {
      // Validar si hay profesores, estudiantes o casos asociados
      const counts = await prisma.$queryRaw`
        SELECT 
          (SELECT COUNT(*)::int FROM "Teacher" WHERE "term" = ${term}) as "teacherCount",
          (SELECT COUNT(*)::int FROM "Student" WHERE "term" = ${term}) as "studentCount",
          (SELECT COUNT(*)::int FROM "Case" WHERE "term" = ${term}) as "caseCount"
      ` as any[];

      const { teacherCount, studentCount, caseCount } = counts[0];

      if (teacherCount > 0 || studentCount > 0 || caseCount > 0) {
        const reasons = [];
        if (teacherCount > 0) reasons.push(`${teacherCount} profesor(es)`);
        if (studentCount > 0) reasons.push(`${studentCount} estudiante(s)`);
        if (caseCount > 0) reasons.push(`${caseCount} caso(s)`);

        return {
          success: false,
          message: `No se puede eliminar el semestre porque tiene ${reasons.join(', ')} asociados.`
        };
      }

      const deletedSemester = await prisma.$queryRaw`
        DELETE FROM "Semester" WHERE "term" = ${term} RETURNING *
      `;

      if (!Array.isArray(deletedSemester) || deletedSemester.length === 0) {
        return { success: false, message: 'Semestre no encontrado' };
      }

      return {
        success: true,
        message: 'Semestre eliminado correctamente'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new SemesterService();
