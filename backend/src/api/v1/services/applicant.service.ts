// @ts-nocheck
import prisma from '../../../config/database.js';

class ApplicantService {
  async getAllApplicants() {
    try {
      const applicants = await prisma.applicant.findMany({
        include: {
          beneficiary: true, // Datos personales (nombre, apellido)
          cases: {
            select: {
              idCase: true,
              description: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return {
        success: true,
        data: applicants,
        count: applicants.length
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener solicitantes',
        error: error.message
      };
    }
  }

  async getApplicantById(id: string) {
    try {
      const applicant = await prisma.applicant.findUnique({
        where: { identityCard: id },
        include: {
          beneficiary: true,
          housing: true,
          cases: {
            include: {
              legalArea: true,
              nucleus: true
            }
          }
        }
      });

      if (!applicant) return { success: false, message: 'Solicitante no encontrado' };

      return { success: true, data: applicant };
    } catch (error) {
      return { success: false, message: 'Error de base de datos' };
    }
  }

  async createApplicant(data: any) {
    try {
      // Usamos transacción porque la info está repartida en 2 tablas
      return await prisma.$transaction(async (tx) => {
        // 1. Crear la persona en Beneficiary
        const beneficiary = await tx.beneficiary.create({
          data: {
            identityCard: data.identityCard,
            name: data.name, // En tu esquema es 'name' (puedes concatenar)
            gender: data.gender,
            birthDate: new Date(data.birthDate),
            idType: data.idType,
            idState: data.idState,
            municipalityNumber: data.municipalityNumber,
            parishNumber: data.parishNumber
          }
        });

        // 2. Crear el perfil socioeconómico en Applicant
        const applicant = await tx.applicant.create({
          data: {
            identityCard: beneficiary.identityCard,
            email: data.email,
            cellPhone: data.cellPhone,
            homePhone: data.homePhone,
            maritalStatus: data.maritalStatus,
            workConditionId: data.workConditionId,
            activityConditionId: data.activityConditionId,
            applicantEducationLevelId: data.educationLevelId
          }
        });

        return { success: true, data: applicant };
      });
    } catch (error) {
      console.log('Error creando solicitante:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteApplicant(id: string) {
    try {
      // Borrar el Beneficiary borra el Applicant por cascada
      await prisma.beneficiary.delete({
        where: { identityCard: id }
      });

      return { success: true, message: 'Solicitante eliminado exitosamente' };
    } catch (error) {
      return { success: false, message: 'No se pudo eliminar' };
    }
  }

  async getApplicantCases(id: string) {
    try {
      const cases = await prisma.case.findMany({
        where: { idApplicant: id },
        include: {
          legalArea: true,
          nucleus: true
        }
      });

      return { success: true, data: cases };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

      async searchApplicants(searchTerm: string) {
      return await prisma.applicant.findMany({
        where: {
          OR: [
            { identityCard: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { 
              beneficiary: {
                name: { contains: searchTerm, mode: 'insensitive' }
              }
            }
          ]
        },
        include: {
          beneficiary: true
        },
        take: 20
      });
    }

  async updateApplicant(id: string, data: any) {
    const { name, gender, birthDate, ...applicantData } = data;

    return await prisma.$transaction(async (tx) => {
      // 1. Actualizar datos personales en Beneficiary si se proporcionan
      if (name || gender || birthDate) {
        await tx.beneficiary.update({
          where: { identityCard: id },
          data: {
            ...(name && { name }),
            ...(gender && { gender }),
            ...(birthDate && { birthDate: new Date(birthDate) }),
          },
        });
      }

      // 2. Actualizar datos socioeconómicos en Applicant
      const updated = await tx.applicant.update({
        where: { identityCard: id },
        data: {
          email: applicantData.email,
          cellPhone: applicantData.cellPhone,
          homePhone: applicantData.homePhone,
          maritalStatus: applicantData.maritalStatus,
          isConcubine: applicantData.isConcubine,
          isHeadOfHousehold: applicantData.isHeadOfHousehold,
          headEducationLevelId: applicantData.headEducationLevelId,
          applicantEducationLevelId: applicantData.applicantEducationLevelId,
          workConditionId: applicantData.workConditionId,
          activityConditionId: applicantData.activityConditionId,
        },
        include: {
          beneficiary: true
        }
      });

      return updated;
    });
  }
}

export default new ApplicantService();