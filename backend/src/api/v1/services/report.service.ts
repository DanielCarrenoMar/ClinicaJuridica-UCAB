// @ts-nocheck
import prisma from '#src/config/database.js';

class ReportService {
  /**
   * Obtiene casos agrupados por materia (Subject)
   */
  async getCasesBySubject(startDate?: Date, endDate?: Date) {
    try {
      console.log('getCasesBySubject llamado con:', { startDate, endDate });
      
      let result;
      if (startDate && endDate) {
        console.log('Ejecutando consulta con rango de fechas');
        result = await prisma.$queryRaw`
          SELECT 
            s."name" as subject,
            COUNT(*)::int as count
          FROM "Case" c
          JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
          JOIN "Subject" s ON la."idSubject" = s."idSubject"
          WHERE c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
            AND s."isActive" = true
            AND la."isActive" = true
          GROUP BY s."idSubject", s."name"
          ORDER BY count DESC
        `;
      } else {
        console.log('Ejecutando consulta sin rango de fechas');
        result = await prisma.$queryRaw`
          SELECT 
            s."name" as subject,
            COUNT(*)::int as count
          FROM "Case" c
          JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
          JOIN "Subject" s ON la."idSubject" = s."idSubject"
          WHERE s."isActive" = true
            AND la."isActive" = true
          GROUP BY s."idSubject", s."name"
          ORDER BY count DESC
        `;
      }

      console.log('Resultado de la consulta:', result);
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error en getCasesBySubject:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene casos agrupados por materia y ámbito (SubjectCategory)
   */
  async getCasesBySubjectScope(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            s."name" as subject,
            sc."name" as scope,
            la."name" as subScope,
            COUNT(*)::int as count
          FROM "Case" c
          JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
          JOIN "SubjectCategory" sc ON la."idSubject" = sc."idSubject" AND la."categoryNumber" = sc."categoryNumber"
          JOIN "Subject" s ON sc."idSubject" = s."idSubject"
          WHERE c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY s."idSubject", s."name", sc."idSubject", sc."categoryNumber", sc."name", la."idLegalArea", la."name"
          ORDER BY s."name", sc."name", la."name"
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            s."name" as subject,
            sc."name" as scope,
            la."name" as subScope,
            COUNT(*)::int as count
          FROM "Case" c
          JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
          JOIN "SubjectCategory" sc ON la."idSubject" = sc."idSubject" AND la."categoryNumber" = sc."categoryNumber"
          JOIN "Subject" s ON sc."idSubject" = s."idSubject"
          GROUP BY s."idSubject", s."name", sc."idSubject", sc."categoryNumber", sc."name", la."idLegalArea", la."name"
          ORDER BY s."name", sc."name", la."name"
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene distribución de solicitantes y beneficiarios por género
   */
  async getGenderDistribution(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            'Applicants' as type,
            b."gender" as gender,
            COUNT(DISTINCT a."identityCard")::int as count
          FROM "Case" c
          JOIN "Applicant" a ON c."applicantId" = a."identityCard"
          JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          WHERE b."gender" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY b."gender"
          
          UNION ALL
          
          SELECT 
            'Beneficiaries' as type,
            b."gender" as gender,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
          WHERE b."gender" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY b."gender"
          ORDER BY type, gender
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            'Applicants' as type,
            b."gender" as gender,
            COUNT(DISTINCT a."identityCard")::int as count
          FROM "Case" c
          JOIN "Applicant" a ON c."applicantId" = a."identityCard"
          JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          WHERE b."gender" IS NOT NULL
          GROUP BY b."gender"
          
          UNION ALL
          
          SELECT 
            'Beneficiaries' as type,
            b."gender" as gender,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
          WHERE b."gender" IS NOT NULL
          GROUP BY b."gender"
          ORDER BY type, gender
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene distribución de solicitantes y beneficiarios por estado
   */
  async getStateDistribution(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            'Applicants' as type,
            st."name" as state,
            COUNT(DISTINCT a."identityCard")::int as count
          FROM "Case" c
          JOIN "Applicant" a ON c."applicantId" = a."identityCard"
          JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          JOIN "Municipality" m ON p."idState" = m."idState" AND p."municipalityNumber" = m."municipalityNumber"
          JOIN "State" st ON m."idState" = st."idState"
          WHERE b."idState" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY st."idState", st."name"
          
          UNION ALL
          
          SELECT 
            'Beneficiaries' as type,
            st."name" as state,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          JOIN "Municipality" m ON p."idState" = m."idState" AND p."municipalityNumber" = m."municipalityNumber"
          JOIN "State" st ON m."idState" = st."idState"
          WHERE b."idState" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY st."idState", st."name"
          ORDER BY type, state
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            'Applicants' as type,
            st."name" as state,
            COUNT(DISTINCT a."identityCard")::int as count
          FROM "Case" c
          JOIN "Applicant" a ON c."applicantId" = a."identityCard"
          JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          JOIN "Municipality" m ON p."idState" = m."idState" AND p."municipalityNumber" = m."municipalityNumber"
          JOIN "State" st ON m."idState" = st."idState"
          WHERE b."idState" IS NOT NULL
          GROUP BY st."idState", st."name"
          
          UNION ALL
          
          SELECT 
            'Beneficiaries' as type,
            st."name" as state,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          JOIN "Municipality" m ON p."idState" = m."idState" AND p."municipalityNumber" = m."municipalityNumber"
          JOIN "State" st ON m."idState" = st."idState"
          WHERE b."idState" IS NOT NULL
          GROUP BY st."idState", st."name"
          ORDER BY type, state
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene distribución de solicitantes y beneficiarios por parroquia
   */
  async getParishDistribution(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            'Applicants' as type,
            p."name" as parish,
            COUNT(DISTINCT a."identityCard")::int as count
          FROM "Case" c
          JOIN "Applicant" a ON c."applicantId" = a."identityCard"
          JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          WHERE b."idState" IS NOT NULL AND b."municipalityNumber" IS NOT NULL AND b."parishNumber" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY p."idState", p."municipalityNumber", p."parishNumber", p."name"
          
          UNION ALL
          
          SELECT 
            'Beneficiaries' as type,
            p."name" as parish,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          WHERE b."idState" IS NOT NULL AND b."municipalityNumber" IS NOT NULL AND b."parishNumber" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY p."idState", p."municipalityNumber", p."parishNumber", p."name"
          ORDER BY type, parish
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            'Applicants' as type,
            p."name" as parish,
            COUNT(DISTINCT a."identityCard")::int as count
          FROM "Case" c
          JOIN "Applicant" a ON c."applicantId" = a."identityCard"
          JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          WHERE b."idState" IS NOT NULL AND b."municipalityNumber" IS NOT NULL AND b."parishNumber" IS NOT NULL
          GROUP BY p."idState", p."municipalityNumber", p."parishNumber", p."name"
          
          UNION ALL
          
          SELECT 
            'Beneficiaries' as type,
            p."name" as parish,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          WHERE b."idState" IS NOT NULL AND b."municipalityNumber" IS NOT NULL AND b."parishNumber" IS NOT NULL
          GROUP BY p."idState", p."municipalityNumber", p."parishNumber", p."name"
          ORDER BY type, parish
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene casos agrupados por tipo de proceso
   */
  async getCasesByType(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            c."processType" as type,
            COUNT(*)::int as count
          FROM "Case" c
          WHERE c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY c."processType"
          ORDER BY count DESC
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            c."processType" as type,
            COUNT(*)::int as count
          FROM "Case" c
          GROUP BY c."processType"
          ORDER BY count DESC
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene beneficiarios directos agrupados por parroquia
   */
  async getBeneficiariesByParish(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            p."name" as parish,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          WHERE cb."type" = 'D' AND b."idState" IS NOT NULL AND b."municipalityNumber" IS NOT NULL AND b."parishNumber" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY p."idState", p."municipalityNumber", p."parishNumber", p."name"
          ORDER BY count DESC
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            p."name" as parish,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
          JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          WHERE cb."type" = 'D' AND b."idState" IS NOT NULL AND b."municipalityNumber" IS NOT NULL AND b."parishNumber" IS NOT NULL
          GROUP BY p."idState", p."municipalityNumber", p."parishNumber", p."name"
          ORDER BY count DESC
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene estudiantes involucrados agrupados por tipo
   */
  async getStudentInvolvement(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            s."type" as type,
            COUNT(DISTINCT asg."studentId")::int as count
          FROM "Case" c
          JOIN "AssignedStudent" asg ON c."idCase" = asg."idCase"
          JOIN "Student" s ON asg."studentId" = s."identityCard" AND asg."term" = s."term"
          WHERE s."type" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY s."type"
          ORDER BY count DESC
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            s."type" as type,
            COUNT(DISTINCT asg."studentId")::int as count
          FROM "Case" c
          JOIN "AssignedStudent" asg ON c."idCase" = asg."idCase"
          JOIN "Student" s ON asg."studentId" = s."identityCard" AND asg."term" = s."term"
          WHERE s."type" IS NOT NULL
          GROUP BY s."type"
          ORDER BY count DESC
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene casos agrupados por tipo de servicio legal (processType)
   */
  async getCasesByServiceType(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            c."processType" as "serviceType",
            COUNT(*)::int as count
          FROM "Case" c
          WHERE c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY c."processType"
          ORDER BY count DESC
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            c."processType" as "serviceType",
            COUNT(*)::int as count
          FROM "Case" c
          GROUP BY c."processType"
          ORDER BY count DESC
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene profesores involucrados agrupados por tipo
   */
  async getProfessorInvolvement(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            t."type" as type,
            COUNT(DISTINCT t."identityCard")::int as count
          FROM "Case" c
          JOIN "Teacher" t ON c."teacherId" = t."identityCard" AND c."teacherTerm" = t."term"
          WHERE t."type" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY t."type"
          ORDER BY count DESC
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            t."type" as type,
            COUNT(DISTINCT t."identityCard")::int as count
          FROM "Case" c
          JOIN "Teacher" t ON c."teacherId" = t."identityCard" AND c."teacherTerm" = t."term"
          WHERE t."type" IS NOT NULL
          GROUP BY t."type"
          ORDER BY count DESC
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene distribución de beneficiarios directos e indirectos
   */
  async getBeneficiaryTypeDistribution(startDate?: Date, endDate?: Date) {
    try {
      let result;
      if (startDate && endDate) {
        result = await prisma.$queryRaw`
          SELECT 
            cb."type" as type,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          WHERE cb."type" IS NOT NULL
            AND c."createdAt" >= ${startDate} AND c."createdAt" <= ${endDate}
          GROUP BY cb."type"
          ORDER BY count DESC
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
            cb."type" as type,
            COUNT(DISTINCT cb."beneficiaryId")::int as count
          FROM "Case" c
          JOIN "CaseBeneficiary" cb ON c."idCase" = cb."idCase"
          WHERE cb."type" IS NOT NULL
          GROUP BY cb."type"
          ORDER BY count DESC
        `;
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ReportService();
