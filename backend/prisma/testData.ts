import { Gender, idNationality, PrismaClient } from './generated/client.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
if (!connectionString) {
    throw new Error('DATABASE_URL no está configurado');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getLegalArea(subjectName: string, categoryName: string, areaName: string) {
    const category = await prisma.subjectCategory.findFirst({
        where: {
            name: categoryName,
            subject: { name: subjectName }
        }
    });

    if (!category) {
        throw new Error(`No se encontró la categoría ${categoryName} para ${subjectName}`);
    }

    const area = await prisma.legalArea.findUnique({
        where: {
            idSubject_categoryNumber_name: {
                idSubject: category.idSubject,
                categoryNumber: category.categoryNumber,
                name: areaName
            }
        }
    });

    if (!area) {
        throw new Error(`No se encontró el área legal ${areaName}`);
    }

    return area;
}

async function ensureCase(caseData: any) {
    const existing = await prisma.case.findFirst({
        where: {
            applicantId: caseData.applicantId,
            idLegalArea: caseData.idLegalArea,
            processType: caseData.processType,
            term: caseData.term
        }
    });

    if (existing) {
        return existing;
    }

    return prisma.case.create({ data: caseData });
}

async function main() {
    console.log('Seeding ubicación y núcleo de prueba');
    const state = await prisma.state.upsert({
        where: { name: 'Distrito Capital' },
        update: {},
        create: { name: 'Distrito Capital' }
    });

    const municipality = await prisma.municipality.upsert({
        where: {
            idState_name: {
                idState: state.idState,
                name: 'Libertador'
            }
        },
        update: {},
        create: {
            idState: state.idState,
            municipalityNumber: 1,
            name: 'Libertador'
        }
    });

    const parish = await prisma.parish.upsert({
        where: {
            idState_municipalityNumber_name: {
                idState: state.idState,
                municipalityNumber: municipality.municipalityNumber,
                name: 'Altagracia'
            }
        },
        update: {},
        create: {
            idState: state.idState,
            municipalityNumber: municipality.municipalityNumber,
            parishNumber: 1,
            name: 'Altagracia'
        }
    });

    const nucleus = await prisma.nucleus.upsert({
        where: { idNucleus: 'GUAYANA' },
        update: {
            idState: state.idState,
            municipalityNumber: municipality.municipalityNumber,
            parishNumber: parish.parishNumber,
            isActive: true
        },
        create: {
            idNucleus: 'GUAYANA',
            isActive: true,
            idState: state.idState,
            municipalityNumber: municipality.municipalityNumber,
            parishNumber: parish.parishNumber
        }
    });

    console.log('Seeding semestre y usuarios académicos');
    const semester = await prisma.semester.upsert({
        where: { term: '2025-01' },
        update: {
            startDate: new Date('2025-01-08'),
            endDate: new Date('2025-06-30')
        },
        create: {
            term: '2025-01',
            startDate: new Date('2025-01-08'),
            endDate: new Date('2025-06-30')
        }
    });

    const teacherUser = await prisma.user.upsert({
        where: { identityCard: '16000001' },
        update: {
            fullName: 'Mariana Díaz',
            gender: Gender.F,
            email: 'mariana.diaz@ucab.edu',
            password: 'seeded-teacher',
            isActive: true,
            type: 'TEACHER' as any
        },
        create: {
            identityCard: '16000001',
            fullName: 'Mariana Díaz',
            gender: Gender.F,
            email: 'mariana.diaz@ucab.edu',
            password: 'seeded-teacher',
            isActive: true,
            type: 'TEACHER' as any
        }
    });

    const teacher = await prisma.teacher.upsert({
        where: {
            identityCard_term: {
                identityCard: teacherUser.identityCard,
                term: semester.term
            }
        },
        update: { type: 'REGULAR' as any },
        create: {
            identityCard: teacherUser.identityCard,
            term: semester.term,
            type: 'REGULAR' as any
        }
    });

    const studentUser = await prisma.user.upsert({
        where: { identityCard: '27000001' },
        update: {
            fullName: 'Luis Gómez',
            gender: Gender.M,
            email: 'luis.gomez@ucab.edu',
            password: 'seeded-student',
            isActive: true,
            type: 'STUDENT' as any
        },
        create: {
            identityCard: '27000001',
            fullName: 'Luis Gómez',
            gender: Gender.M,
            email: 'luis.gomez@ucab.edu',
            password: 'seeded-student',
            isActive: true,
            type: 'STUDENT' as any
        }
    });

    const student = await prisma.student.upsert({
        where: {
            identityCard_term: {
                identityCard: studentUser.identityCard,
                term: semester.term
            }
        },
        update: { type: 'REGULAR' as any, nrc: 'UCAB-101' },
        create: {
            identityCard: studentUser.identityCard,
            term: semester.term,
            nrc: 'UCAB-101',
            type: 'REGULAR' as any
        }
    });

    console.log('Seeding solicitantes y beneficiarios de prueba');
    const universityLevel = await prisma.educationLevel.findUnique({ where: { name: 'Universitaria' } });
    const mediaLevel = await prisma.educationLevel.findUnique({ where: { name: 'Media Diversificada (5to año)' } });
    const employeeCondition = await prisma.workCondition.findUnique({ where: { name: 'Empleado' } });
    const patronoCondition = await prisma.workCondition.findUnique({ where: { name: 'Patrono' } });
    const activityStudent = await prisma.activityCondition.findUnique({ where: { name: 'Estudiante' } });
    const activityOther = await prisma.activityCondition.findUnique({ where: { name: 'Otra' } });

    const beneficiaryOne = await prisma.beneficiary.upsert({
        where: { identityCard: '80010001' },
        update: {
            gender: Gender.F,
            birthDate: new Date('1989-04-12'),
            fullName: 'Laura Campos',
            idNationality: "VENEZUELAN" as idNationality,
            hasId: true,
            type: 'APPLICANT' as any,
            idState: state.idState,
            municipalityNumber: municipality.municipalityNumber,
            parishNumber: parish.parishNumber
        },
        create: {
            identityCard: '80010001',
            gender: Gender.F,
            birthDate: new Date('1989-04-12'),
            fullName: 'Laura Campos',
            idNationality: "VENEZUELAN" as idNationality,
            hasId: true,
            type: 'APPLICANT' as any,
            idState: state.idState,
            municipalityNumber: municipality.municipalityNumber,
            parishNumber: parish.parishNumber
        }
    });

    const applicantOne = await prisma.applicant.upsert({
        where: { identityCard: beneficiaryOne.identityCard },
        update: {
            email: 'laura.campos@example.com',
            cellPhone: '+58-412-1112233',
            maritalStatus: 'MARRIED' as any,
            isConcubine: false,
            isHeadOfHousehold: true,
            headEducationLevelId: universityLevel?.idLevel,
            headStudyTime: 'Tiempo completo',
            applicantEducationLevelId: universityLevel?.idLevel,
            applicantStudyTime: 'Vespertino',
            workConditionId: employeeCondition?.idCondition,
            activityConditionId: activityStudent?.idActivity
        },
        create: {
            identityCard: beneficiaryOne.identityCard,
            email: 'laura.campos@example.com',
            cellPhone: '+58-412-1112233',
            maritalStatus: 'MARRIED' as any,
            isConcubine: false,
            isHeadOfHousehold: true,
            headEducationLevelId: universityLevel?.idLevel,
            headStudyTime: 'Tiempo completo',
            applicantEducationLevelId: universityLevel?.idLevel,
            applicantStudyTime: 'Vespertino',
            workConditionId: employeeCondition?.idCondition,
            activityConditionId: activityStudent?.idActivity
        }
    });

    const beneficiaryTwo = await prisma.beneficiary.upsert({
        where: { identityCard: '80010002' },
        update: {
            gender: Gender.M,
            birthDate: new Date('1984-07-30'),
            fullName: 'Carlos Fuentes',
            idNationality: "VENEZUELAN" as idNationality,
            hasId: true,
            type: 'APPLICANT' as any,
            idState: state.idState,
            municipalityNumber: municipality.municipalityNumber,
            parishNumber: parish.parishNumber
        },
        create: {
            identityCard: '80010002',
            gender: Gender.M,
            birthDate: new Date('1984-07-30'),
            fullName: 'Carlos Fuentes',
            idNationality: "VENEZUELAN" as idNationality,
            hasId: true,
            type: 'APPLICANT' as any,
            idState: state.idState,
            municipalityNumber: municipality.municipalityNumber,
            parishNumber: parish.parishNumber
        }
    });

    const applicantTwo = await prisma.applicant.upsert({
        where: { identityCard: beneficiaryTwo.identityCard },
        update: {
            email: 'carlos.fuentes@example.com',
            cellPhone: '+58-414-2223344',
            maritalStatus: 'DIVORCED' as any,
            isConcubine: true,
            isHeadOfHousehold: true,
            headEducationLevelId: mediaLevel?.idLevel,
            headStudyTime: 'Nocturno',
            applicantEducationLevelId: mediaLevel?.idLevel,
            applicantStudyTime: 'Nocturno',
            workConditionId: patronoCondition?.idCondition,
            activityConditionId: activityOther?.idActivity
        },
        create: {
            identityCard: beneficiaryTwo.identityCard,
            email: 'carlos.fuentes@example.com',
            cellPhone: '+58-414-2223344',
            maritalStatus: 'DIVORCED' as any,
            isConcubine: true,
            isHeadOfHousehold: true,
            headEducationLevelId: mediaLevel?.idLevel,
            headStudyTime: 'Nocturno',
            applicantEducationLevelId: mediaLevel?.idLevel,
            applicantStudyTime: 'Nocturno',
            workConditionId: patronoCondition?.idCondition,
            activityConditionId: activityOther?.idActivity
        }
    });

    console.log('Seeding casos de prueba');
    const justificativoSolteria = await getLegalArea('Materia Civil', 'Personas', 'Justificativo de Soltería');
    const divorcioSeparacion = await getLegalArea('Materia Civil', 'Familia - Tribunales Ordinarios', 'Divorcio por separación de hechos (185-A)');

    const caseOne = await ensureCase({
        problemSummary: 'Requiere justificativo de soltería para trámite notarial.',
        processType: 'IN_PROGRESS' as any,
        applicantId: applicantOne.identityCard,
        idNucleus: nucleus.idNucleus,
        term: semester.term,
        idLegalArea: justificativoSolteria.idLegalArea,
        teacherId: teacher.identityCard,
        teacherTerm: teacher.term,
        idCourt: null
    });

    const caseTwo = await ensureCase({
        problemSummary: 'Conflicto familiar que deriva en divorcio por separación de hecho.',
        processType: 'ADVICE' as any,
        applicantId: applicantTwo.identityCard,
        idNucleus: nucleus.idNucleus,
        term: semester.term,
        idLegalArea: divorcioSeparacion.idLegalArea,
        teacherId: teacher.identityCard,
        teacherTerm: teacher.term,
        idCourt: null
    });

    await prisma.caseStatus.upsert({
        where: { idCase_statusNumber: { idCase: caseOne.idCase, statusNumber: 1 } },
        update: {
            status: 'OPEN' as any,
            reason: 'Caso creado para datos de prueba',
            userId: teacherUser.identityCard,
            registryDate: new Date()
        },
        create: {
            idCase: caseOne.idCase,
            statusNumber: 1,
            status: 'OPEN' as any,
            reason: 'Caso creado para datos de prueba',
            userId: teacherUser.identityCard,
            registryDate: new Date()
        }
    });

    await prisma.caseStatus.upsert({
        where: { idCase_statusNumber: { idCase: caseTwo.idCase, statusNumber: 1 } },
        update: {
            status: 'OPEN' as any,
            reason: 'Caso creado para datos de prueba',
            userId: teacherUser.identityCard,
            registryDate: new Date()
        },
        create: {
            idCase: caseTwo.idCase,
            statusNumber: 1,
            status: 'OPEN' as any,
            reason: 'Caso creado para datos de prueba',
            userId: teacherUser.identityCard,
            registryDate: new Date()
        }
    });

    await prisma.caseBeneficiary.upsert({
        where: { idCase_beneficiaryId: { idCase: caseOne.idCase, beneficiaryId: applicantOne.identityCard } },
        update: {
            relationship: 'Solicitante',
            type: 'DIRECT' as any,
            description: 'Titular del caso'
        },
        create: {
            idCase: caseOne.idCase,
            beneficiaryId: applicantOne.identityCard,
            relationship: 'Solicitante',
            type: 'DIRECT' as any,
            description: 'Titular del caso'
        }
    });

    await prisma.caseBeneficiary.upsert({
        where: { idCase_beneficiaryId: { idCase: caseTwo.idCase, beneficiaryId: applicantTwo.identityCard } },
        update: {
            relationship: 'Solicitante',
            type: 'DIRECT' as any,
            description: 'Titular del caso'
        },
        create: {
            idCase: caseTwo.idCase,
            beneficiaryId: applicantTwo.identityCard,
            relationship: 'Solicitante',
            type: 'DIRECT' as any,
            description: 'Titular del caso'
        }
    });

    await prisma.assignedStudent.upsert({
        where: {
            idCase_studentId_term: {
                idCase: caseOne.idCase,
                studentId: student.identityCard,
                term: student.term
            }
        },
        update: {},
        create: {
            idCase: caseOne.idCase,
            studentId: student.identityCard,
            term: student.term
        }
    });

    await prisma.assignedStudent.upsert({
        where: {
            idCase_studentId_term: {
                idCase: caseTwo.idCase,
                studentId: student.identityCard,
                term: student.term
            }
        },
        update: {},
        create: {
            idCase: caseTwo.idCase,
            studentId: student.identityCard,
            term: student.term
        }
    });

    console.log('✅ Seeding completed!');


}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
