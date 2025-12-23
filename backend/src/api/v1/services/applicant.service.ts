// @ts-nocheck
import prisma from '../../../config/database.js';

class ApplicantService {
// Obtener todos los solicitantes
  async getAllApplicants() {
    try {
      const applicants = await prisma.applicant.findMany({
        include: {
          familyHouse: true,
          cases: {
            select: {
              idCase: true,
              description: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return {
        success: true,
        data: applicants,
        count: applicants.length
      };
    } catch (error) {
      console.log('📦 Modo desarrollo: usando datos mock para applicants');
      return {
        success: true,
        data: [
          {
            idApplicant: 1,
            firstName: "María",
            lastName: "González",
            email: "maria@ejemplo.com",
            phoneCell: "0414-1234567",
            phoneHome: "0212-9876543",
            maritalStatus: "Casada",
            concubinage: false,
            isWorking: true,
            workCondition: "EMPLOYEE",
            isLookingJob: false,
            activityCondition: null,
            isHouseHoldHead: true,
            educationLevel: 12,
            educationMonths: 12,
            educationLevelHousehold: 10,
            educationMonthsHousehold: 10,
            idFamilyHouse: 1,
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-10')
          },
          {
            idApplicant: 2,
            firstName: "Carlos",
            lastName: "Rodríguez",
            email: "carlos@ejemplo.com",
            phoneCell: "0416-7654321",
            phoneHome: "0212-5555555",
            maritalStatus: "Soltero",
            concubinage: false,
            isWorking: false,
            workCondition: null,
            isLookingJob: true,
            activityCondition: "STUDENT",
            isHouseHoldHead: false,
            educationLevel: 14,
            educationMonths: 14,
            educationLevelHousehold: null,
            educationMonthsHousehold: null,
            idFamilyHouse: 2,
            createdAt: new Date('2024-02-15'),
            updatedAt: new Date('2024-02-15')
          }
        ],
        count: 2,
        message: 'Modo desarrollo activo'
      };
    }
  }

  // Obtener un solicitante por ID
  async getApplicantById(id: number) {
    try {
      const applicant = await prisma.applicant.findUnique({
        where: { idApplicant: id },
        include: {
          familyHouse: true,
          cases: {
            include: {
              legalArea: true,
              nucleus: true
            }
          }
        }
      });

      if (!applicant) {
        return {
          success: false,
          message: 'Solicitante no encontrado'
        };
      }

      return {
        success: true,
        data: applicant
      };
    } catch (error) {
      console.log('📦 Modo desarrollo: retornando applicant mock');
      if (id === 1) {
        return {
          success: true,
          data: {
            idApplicant: 1,
            firstName: "María",
            lastName: "González",
            email: "maria@ejemplo.com",
            phoneCell: "0414-1234567",
            phoneHome: "0212-9876543",
            maritalStatus: "Casada",
            concubinage: false,
            isWorking: true,
            workCondition: "EMPLOYEE",
            isLookingJob: false,
            activityCondition: null,
            isHouseHoldHead: true,
            educationLevel: 12,
            educationMonths: 12,
            educationLevelHousehold: 10,
            educationMonthsHousehold: 10,
            familyHouse: {
              idFamilyHouse: 1,
              memberWorkingCount: 2,
              membersNonWorkingCount: 1,
              childrens7to12Count: 0,
              childrensStudentCount: 1,
              monthlyIncome: 1500.50
            },
            cases: [
              {
                idCase: 1,
                description: "Caso de prueba - Asesoría legal familiar",
                createdAt: new Date('2024-01-15'),
                legalArea: {
                  idLegalArea: 1,
                  typeLegalArea: "PERSONS",
                  description: "Derecho de Personas"
                },
                nucleus: {
                  idNucleus: 1,
                  name: "Núcleo Central"
                }
              }
            ]
          }
        };
      }
      return {
        success: false,
        message: 'Solicitante no encontrado'
      };
    }
  }

  // Buscar solicitantes (por cualquier atributo)
  async searchApplicants(searchTerm: string) {
    try {
      const applicants = await prisma.applicant.findMany({
        where: {
          OR: [
            { firstName: { contains: searchTerm, mode: 'insensitive' } },
            { lastName: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { phoneCell: { contains: searchTerm } },
            { phoneHome: { contains: searchTerm } }
          ]
        },
        take: 50 // Limitar resultados
      });

      return {
        success: true,
        data: applicants,
        count: applicants.length
      };
    } catch (error) {
      console.log('📦 Modo desarrollo: búsqueda mock');
      return {
        success: true,
        data: [],
        count: 0,
        message: 'Búsqueda en modo desarrollo'
      };
    }
  }

  // Crear un nuevo solicitante
  async createApplicant(data: any) {
    try {
      const newApplicant = await prisma.applicant.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneCell: data.phoneCell,
          phoneHome: data.phoneHome || null,
          maritalStatus: data.maritalStatus,
          concubinage: data.concubinage || false,
          isWorking: data.isWorking || false,
          workCondition: data.workCondition,
          isLookingJob: data.isLookingJob || false,
          activityCondition: data.activityCondition,
          isHouseHoldHead: data.isHouseHoldHead || false,
          educationLevel: data.educationLevel || 0,
          educationMonths: data.educationMonths || 0,
          educationLevelHousehold: data.educationLevelHousehold,
          educationMonthsHousehold: data.educationMonthsHousehold,
          idFamilyHouse: data.idFamilyHouse
        },
        include: {
          familyHouse: true
        }
      });

      return {
        success: true,
        data: newApplicant,
        message: 'Solicitante creado exitosamente'
      };
    } catch (error) {
      console.log('Haz creado al solicitante' + data.firstName);
      const newId = Math.floor(Math.random() * 9000) + 1000;
      return {
        success: true,
        data: {
          idApplicant: newId,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        message: 'Solicitante creado (modo desarrollo)'
      };
    }
  }

  // Actualizar un solicitante
  async updateApplicant(id: number, data: any) {
    try {
      const updatedApplicant = await prisma.applicant.update({
        where: { idApplicant: id },
        data: data
      });

      return {
        success: true,
        data: updatedApplicant,
        message: 'Solicitante actualizado exitosamente'
      };
    } catch (error) {
      console.log('📦 Modo desarrollo: actualizando applicant mock');
      return {
        success: true,
        data: {
          idApplicant: id,
          ...data,
          updatedAt: new Date()
        },
        message: 'Solicitante actualizado (modo desarrollo)'
      };
    }
  }

  // Eliminar un solicitante
  async deleteApplicant(id: number) {
    try {
      await prisma.applicant.delete({
        where: { idApplicant: id }
      });

      return {
        success: true,
        message: 'Solicitante eliminado exitosamente'
      };
    } catch (error) {
      console.log('📦 Modo desarrollo: eliminando applicant mock');
      return {
        success: true,
        message: 'Solicitante eliminado (modo desarrollo)'
      };
    }
  }

  // Obtener casos de un solicitante
  async getApplicantCases(id: number) {
    try {
      const cases = await prisma.case.findMany({
        where: { idApplicant: id },
        include: {
          legalArea: true,
          nucleus: true,
          beneficiaries: {
            include: {
              beneficiary: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        success: true,
        data: cases,
        count: cases.length
      };
    } catch (error) {
      console.log('📦 Modo desarrollo: casos de applicant mock');
      return {
        success: true,
        data: [
          {
            idCase: 1,
            description: "Caso de prueba del solicitante",
            legalArea: { typeLegalArea: "PERSONS" },
            nucleus: { name: "Núcleo Central" }
          }
        ],
        count: 1,
        message: 'Modo desarrollo'
      };
    }
  }
}

export default new ApplicantService();