import prisma from "../../../config/database.js";

class ConfigService {
  async getSemesters() {
    return await prisma.semester.findMany({
      orderBy: { startDate: "desc" },
    });
  }

  async createSemester(data: { term: string; startDate: string; endDate: string }) {
    return await prisma.semester.create({
      data: {
        term: data.term,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  async getLocations() {
    return await prisma.state.findMany({
      include: {
        municipalities: {
          include: {
            parishes: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async getLegalStructure() {
    return await prisma.subject.findMany({
      include: {
        categories: {
          include: {
            legalAreas: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async getApplicantMetadata() {
    const [educationLevels, workConditions, activityConditions] = await Promise.all([
      prisma.educationLevel.findMany({ where: { isActive: true }, orderBy: { idLevel: "asc" } }),
      prisma.workCondition.findMany({ where: { isActive: true }, orderBy: { idCondition: "asc" } }),
      prisma.activityCondition.findMany({ where: { isActive: true }, orderBy: { idActivity: "asc" } }),
    ]);

    return {
      educationLevels,
      workConditions,
      activityConditions,
    };
  }

  async getHousingCharacteristics() {
    return await prisma.housingCharacteristic.findMany({
      include: {
        details: {
          where: { isActive: true },
          orderBy: { detailNumber: "asc" },
        },
      },
      where: { isActive: true },
    });
  }

  async getCourts() {
    return await prisma.court.findMany({
      where: { isActive: true },
      orderBy: { subject: "asc" },
    });
  }

  async getNuclei() {
    return await prisma.nucleus.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }
}

export default new ConfigService();