// @ts-nocheck
import prisma from '#src/config/database.js';

class StatsService {
  async getQuantityByType(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          ct.name,
          COUNT(*) as count
        FROM "Case" c
        INNER JOIN "CaseType" ct ON c."idCaseType" = ct."idCaseType"
        WHERE 1=1 ${dateFilter}
        GROUP BY ct.name
        ORDER BY count DESC
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: s.name || 'Sin Tipo',
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getQuantityByStatus(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          cs.name,
          COUNT(*) as count
        FROM "Case" c
        INNER JOIN "CaseStatus" cs ON c."idCaseStatus" = cs."idCaseStatus"
        WHERE 1=1 ${dateFilter}
        GROUP BY cs.name
        ORDER BY count DESC
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: s.name || 'Sin Estado',
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getQuantityByParish(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          p.name,
          COUNT(*) as count
        FROM "Case" c
        INNER JOIN "Parish" p ON c."idParish" = p."idParish"
        WHERE 1=1 ${dateFilter}
        GROUP BY p.name
        ORDER BY count DESC
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: s.name || 'Sin Parroquia',
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getQuantityByPeriod(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', c."createdAt") as period,
          COUNT(*) as count
        FROM "Case" c
        WHERE 1=1 ${dateFilter}
        GROUP BY DATE_TRUNC('month', c."createdAt")
        ORDER BY period ASC
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: new Date(s.period).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getQuantityBySubject(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          cs.name,
          COUNT(*) as count
        FROM "Case" c
        INNER JOIN "CaseSubject" cs ON c."idCaseSubject" = cs."idCaseSubject"
        WHERE 1=1 ${dateFilter}
        GROUP BY cs.name
        ORDER BY count DESC
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: s.name || 'Sin Materia',
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getQuantityBySubjectScope(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          s.name as subject,
          sc.name as scope,
          la.name as legal_area,
          COUNT(*) as count
        FROM "Case" c
        INNER JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
        INNER JOIN "SubjectCategory" sc ON la."idSubject" = sc."idSubject" 
          AND la."categoryNumber" = sc."categoryNumber"
        INNER JOIN "Subject" s ON sc."idSubject" = s."idSubject"
        WHERE 1=1 ${dateFilter}
        GROUP BY s.name, sc.name, la.name
        ORDER BY s.name, sc.name, la.name
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        subject: s.subject || 'Sin Materia',
        scope: s.scope || 'Sin Ámbito',
        legal_area: s.legal_area || 'Sin Área Legal',
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getApplicantsByGender(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          a.gender,
          COUNT(*) as count
        FROM "Case" c
        INNER JOIN "Applicant" a ON c."applicantId" = a."identityCard"
        WHERE 1=1 ${dateFilter}
        GROUP BY a.gender
        ORDER BY a.gender
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = [
        {
          label: 'Solicitantes Hombres',
          value: Number(stats.find((s: any) => s.gender === 'M')?.count || 0),
          color: '#45B7D1'
        },
        {
          label: 'Solicitantes Mujeres',
          value: Number(stats.find((s: any) => s.gender === 'F')?.count || 0),
          color: '#FF6B6B'
        }
      ];

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getApplicantsByState(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          s.name as stateName,
          COUNT(*) as count
        FROM "Case" c
        INNER JOIN "Applicant" a ON c."applicantId" = a."identityCard"
        INNER JOIN "State" s ON a."idState" = s."idState"
        WHERE 1=1 ${dateFilter}
        GROUP BY s.name
        ORDER BY count DESC
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: `Solicitantes ${s.stateName || 'Sin Estado'}`,
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getApplicantsByParish(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          p.name as parishName,
          COUNT(*) as count
        FROM "Case" c
        INNER JOIN "Applicant" a ON c."applicantId" = a."identityCard"
        INNER JOIN "Parish" p ON a."idState" = p."idState" 
          AND a."municipalityNumber" = p."municipalityNumber" 
          AND a."parishNumber" = p."parishNumber"
        WHERE 1=1 ${dateFilter}
        GROUP BY p.name
        ORDER BY count DESC
        LIMIT 10
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: `Solicitantes ${s.parishName || 'Sin Parroquia'}`,
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBeneficiaryTypeCount(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          cb.type,
          COUNT(DISTINCT cb."beneficiaryId") as count
        FROM "CaseBeneficiary" cb
        INNER JOIN "Case" c ON cb."idCase" = c."idCase"
        WHERE 1=1 ${dateFilter}
        GROUP BY cb.type
        ORDER BY cb.type
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = [
        {
          label: 'Beneficiarios Directos',
          value: Number(stats.find((s: any) => s.type === 'D')?.count || 0),
          color: '#3498DB'
        },
        {
          label: 'Beneficiarios Indirectos', 
          value: Number(stats.find((s: any) => s.type === 'I')?.count || 0),
          color: '#E74C3C'
        }
      ];

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBeneficiariesByParish(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          p.name as parishName,
          COUNT(DISTINCT cb."beneficiaryId") as count
        FROM "CaseBeneficiary" cb
        INNER JOIN "Case" c ON cb."idCase" = c."idCase"
        INNER JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
        INNER JOIN "Parish" p ON b."idState" = p."idState" 
          AND b."municipalityNumber" = p."municipalityNumber" 
          AND b."parishNumber" = p."parishNumber"
        WHERE 1=1 ${dateFilter}
        GROUP BY p.name
        ORDER BY count DESC
        LIMIT 10
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: `Beneficiarios ${s.parishName || 'Sin Parroquia'}`,
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getStudentsByType(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          s.type,
          COUNT(DISTINCT s."studentId") as count
        FROM "StudentCase" sc
        INNER JOIN "Case" c ON sc."idCase" = c."idCase"
        INNER JOIN "Student" s ON sc."studentId" = s."studentId"
        WHERE 1=1 ${dateFilter}
        GROUP BY s.type
        ORDER BY s.type
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: `Estudiantes ${s.type || 'Sin Tipo'}`,
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getTeachersByType(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          t.type,
          COUNT(DISTINCT t."teacherId") as count
        FROM "TeacherCase" tc
        INNER JOIN "Case" c ON tc."idCase" = c."idCase"
        INNER JOIN "Teacher" t ON tc."teacherId" = t."teacherId"
        WHERE 1=1 ${dateFilter}
        GROUP BY t.type
        ORDER BY t.type
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = stats.map((s: any) => ({
        label: `Profesores ${s.type || 'Sin Tipo'}`,
        value: Number(s.count || 0),
        color: this.getRandomColor()
      }));

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private getRandomColor(): string {
    const colors = [
      '#90EE90', '#4169E1', '#9370DB', '#FFD700', '#8B4513',
      '#45B7D1', '#FF6B6B', '#5DADE2', '#EC7063', '#48C9B0',
      '#F1948A', '#76D7C4', '#F5B7B1', '#85C1E2', '#F8C471'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export default new StatsService();
