import prisma from "../../../config/database.js";

class CaseService {
  async getAllCases() {
    try {
      const cases = await prisma.case.findMany({
        include: {
          applicant: { include: { beneficiary: true } },
          legalArea: true,
          nucleus: true,
          actions: true 
        },
        orderBy: { idCase: 'desc' }
      });
      
      return { success: true, data: cases, count: cases.length };
    } catch (error: any) {
      return { success: false, message: 'Error al obtener casos', error: error.message };
    }
  }

  async getCaseById(idCase: number) {
    try {
      const caseData = await prisma.case.findUnique({
        where: { idCase },
        include: {
          applicant: { include: { beneficiary: true } },
          legalArea: true,
          nucleus: true,
          actions: { 
            orderBy: { actionNumber: 'desc' }
          },
          supports: true, 
          appointments: true, 
          statuses: true, 
          assignedStudents: { 
            include: {
              student: { include: { user: true } }
            }
          }
        }
      });

      if (!caseData) return { success: false, message: 'Caso no encontrado' };

      return { success: true, data: caseData };
    } catch (error: any) {
      return { success: false, message: 'Error al buscar el caso', error: error.message };
    }
  }

  async createCase(data: any) {
    try {
      const newCase = await prisma.case.create({
        data: {
          problemSummary: data.problemSummary,
          processType: data.processType,
          applicantId: data.applicantId,
          idNucleus: data.idNucleus,
          term: data.term,
          idLegalArea: data.idLegalArea,
          teacherId: data.teacherId,
          teacherTerm: data.teacherTerm 
        }
      });

      return { success: true, data: newCase, message: 'Caso creado exitosamente' };
    } catch (error: any) {
      return { success: false, message: 'Error al crear el caso', error: error.message };
    }
  }

  async searchCases(searchTerm: string) {
    try {
      const cases = await prisma.case.findMany({
        where: {
          OR: [
            { problemSummary: { contains: searchTerm, mode: 'insensitive' } },
            { applicantId: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        include: {
          applicant: { include: { beneficiary: true } }
        }
      });
      return { success: true, data: cases };
    } catch (error: any) {
      return { success: false, message: 'Error en la búsqueda', error: error.message };
    }
  }

  async deleteCase(idCase: number) {
    try {
      await prisma.case.delete({
        where: { idCase }
      });
      return { success: true, message: 'Caso eliminado exitosamente' };
    } catch (error: any) {
      return { success: false, message: 'Error al eliminar el caso', error: error.message };
    }
  }
}

export default new CaseService();