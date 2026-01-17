import { Gender, idNationality, PrismaClient, UserType, TeacherType, StudentType, BeneficiaryType, MaritalStatus, CaseStatusEnum, CaseBeneficiaryType, WorkCondition, ActivityCondition } from '#src/generated/client.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const connectionString = `${process.env.DATABASE_URL}`;
if (!connectionString) {
    throw new Error('DATABASE_URL no está configurado');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ACTION_PHRASES = [
    "Revisión inicial del expediente",
    "Entrevista con el solicitante",
    "Redacción de documento preliminar",
    "Consulta con el coordinador",
    "Visita al tribunal",
    "Llamada telefónica al beneficiario",
    "Recepción de documentos faltantes",
    "Análisis de jurisprudencia aplicable",
    "Preparación para la audiencia",
    "Cierre parcial del caso",
    "Actualización de estado del proceso",
    "Verificación de recaudos"
];

const PROBLEM_SUMMARIES = [
    "Solicitud de divorcio de mutuo acuerdo",
    "Reclamación de manutención infantil",
    "Disputa por linderos de terreno",
    "Redacción de testamento abierto",
    "Asesoría legal por despido injustificado",
    "Trámite de declaración de únicos y universales herederos",
    "Conflicto de convivencia vecinal",
    "Solicitud de curatela",
    "Rectificación de acta de nacimiento",
    "Poder especial para trámites bancarios",
    "Asesoría en contrato de arrendamiento",
    "Violencia intrafamiliar",
    "Adopción plena",
    "Reconocimiento de filiación",
    "Régimen de convivencia familiar",
    "Autorización de viaje para menor",
    "Título supletorio",
    "Separación de cuerpos",
    "Inquisición de paternidad",
    "Liquidación de comunidad conyugal"
];

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
    // Check existence by some unique combo (e.g. applicant + term + legalArea could be repeated, 
    // but for seeding let's try to match exactly or just create)
    // Here we will just create to ensure we have volume, unless it looks like a duplicate from previous runs
    // For safety in this script, we'll check applicant and summary
    const existing = await prisma.case.findFirst({
        where: {
            applicantId: caseData.applicantId,
            idLegalArea: caseData.idLegalArea,
            problemSummary: caseData.problemSummary
        }
    });

    if (existing) {
        return existing;
    }

    return prisma.case.create({ data: caseData });
}

async function main() {
    console.log('--- Iniciando carga de datos de prueba ---');

    console.log('Configurando ubicación y núcleo...');
    const state = await prisma.state.upsert({
        where: { name: 'Distrito Capital' },
        update: {},
        create: { name: 'Distrito Capital' }
    });

    const municipality = await prisma.municipality.upsert({
        where: { idState_name: { idState: state.idState, name: 'Libertador' } },
        update: {},
        create: { idState: state.idState, municipalityNumber: 1, name: 'Libertador' }
    });

    const parish = await prisma.parish.upsert({
        where: { idState_municipalityNumber_name: { idState: state.idState, municipalityNumber: municipality.municipalityNumber, name: 'Altagracia' } },
        update: {},
        create: { idState: state.idState, municipalityNumber: municipality.municipalityNumber, parishNumber: 1, name: 'Altagracia' }
    });

    const nucleus = await prisma.nucleus.upsert({
        where: { idNucleus: 'GUAYANA' },
        update: { isActive: true },
        create: {
            idNucleus: 'GUAYANA',
            isActive: true,
            idState: state.idState,
            municipalityNumber: municipality.municipalityNumber,
            parishNumber: parish.parishNumber
        }
    });

    console.log('Configurando semestre...');
    const semester = await prisma.semester.upsert({
        where: { term: '2025-15' },
        update: {},
        create: {
            term: '2025-15',
            startDate: new Date('2025-01-08'),
            endDate: new Date('2025-06-30')
        }
    });

    console.log('Creando usuarios (Coordinador y Profesor)...');
    const teacherPass = await bcrypt.hash('seeded-teacher', SALT_ROUNDS);
    const teacherUser = await prisma.user.upsert({
        where: { identityCard: '16000001' },
        update: {},
        create: {
            identityCard: '16000001',
            fullName: 'Mariana Díaz',
            gender: Gender.F,
            email: 'mariana.diaz@ucab.edu',
            password: teacherPass,
            isActive: true,
            type: 'TEACHER' as any
        }
    });

    const teacher = await prisma.teacher.upsert({
        where: { identityCard_term: { identityCard: teacherUser.identityCard, term: semester.term } },
        update: {},
        create: { identityCard: teacherUser.identityCard, term: semester.term, type: 'REGULAR' as any }
    });

    const coordPass = await bcrypt.hash('seeded-coordinator', SALT_ROUNDS);
    const coordinadorUser = await prisma.user.upsert({
        where: { identityCard: '15000001' },
        update: {},
        create: {
            identityCard: '15000001',
            fullName: 'Ana Pérez',
            gender: Gender.F,
            email: 'ana.perez@ucab.edu',
            password: coordPass,
            isActive: true,
            type: 'COORDINATOR' as any
        }
    });
    
    await prisma.coordinator.upsert({
        where: { identityCard: coordinadorUser.identityCard },
        update: {},
        create: { identityCard: coordinadorUser.identityCard }
    });

    console.log('Creando 18 estudiantes...');
    const students = [];
    const studentPass = await bcrypt.hash('seeded-student', SALT_ROUNDS);
    
    for (let i = 1; i <= 18; i++) {
        const idCard = (27000000 + i).toString();
        const user = await prisma.user.upsert({
            where: { identityCard: idCard },
            update: {},
            create: {
                identityCard: idCard,
                fullName: `Estudiante ${i}`,
                gender: i % 2 === 0 ? Gender.F : Gender.M,
                email: `estudiante.${i}@ucab.edu`,
                password: studentPass,
                isActive: true,
                type: 'STUDENT' as any
            }
        });

        const student = await prisma.student.upsert({
            where: { identityCard_term: { identityCard: user.identityCard, term: semester.term } },
            update: {},
            create: {
                identityCard: user.identityCard,
                term: semester.term,
                nrc: 'UCAB-101',
                type: 'REGULAR' as any
            }
        });
        students.push(student);
    }

    console.log('Creando beneficiarios y solicitantes...');
    // We'll create 5 base applicants to distribute cases among them, plus the 2 specific ones requested before
    const applicants = [];
    
    // Original 2 applicants
    const appInfoUnique = [
        { id: '80010001', name: 'Laura Campos', gender: Gender.F, email: 'laura.campos@example.com' },
        { id: '80010002', name: 'Carlos Fuentes', gender: Gender.M, email: 'carlos.fuentes@example.com' }
    ];

    // Generic additional applicants
    for(let i=3; i<=10; i++) {
        appInfoUnique.push({
            id: (80010000 + i).toString(),
            name: `Solicitante ${i}`,
            gender: i % 2 === 0 ? Gender.F : Gender.M,
            email: `solicitante.${i}@example.com`
        });
    }

    const universityLevel = await prisma.educationLevel.findFirst();
    const employeeCondition = await prisma.workCondition.findFirst();
    const activityCondition = await prisma.activityCondition.findFirst();

    for (const info of appInfoUnique) {
        const ben = await prisma.beneficiary.upsert({
            where: { identityCard: info.id },
            update: {},
            create: {
                identityCard: info.id,
                fullName: info.name,
                gender: info.gender,
                birthDate: new Date('1990-01-01'),
                idNationality: 'VENEZUELAN' as any,
                hasId: true,
                type: 'APPLICANT' as any,
                idState: state.idState,
                municipalityNumber: municipality.municipalityNumber,
                parishNumber: parish.parishNumber
            }
        });

        const app = await prisma.applicant.upsert({
            where: { identityCard: ben.identityCard },
            update: {},
            create: {
                identityCard: ben.identityCard,
                email: info.email,
                cellPhone: '+58-412-0000000',
                maritalStatus: 'SINGLE' as any,
                isConcubine: false,
                isHeadOfHousehold: true,
                headEducationLevelId: universityLevel?.idLevel,
                headStudyTime: 'Tiempo completo',
                applicantEducationLevelId: universityLevel?.idLevel,
                applicantStudyTime: 'Tiempo completo',
                workConditionId: employeeCondition?.idCondition,
                activityConditionId: activityCondition?.idActivity
            }
        });
        applicants.push(app);
    }

    console.log('Creando 20 casos...');
    const justificativoSolteria = await getLegalArea('Materia Civil', 'Personas', 'Justificativo de Soltería');
    const divorcioSeparacion = await getLegalArea('Materia Civil', 'Familia - Tribunales Ordinarios', 'Divorcio por separación de hechos (185-A)');
    const areas = [justificativoSolteria, divorcioSeparacion];
    
    // We will create cases now
    // We mix problem summaries and applicants
    const allCases = [];

    // Ensure we run the loop 20 times using random assignment
    for (let i = 0; i < 20; i++) {
        const summary = PROBLEM_SUMMARIES[i % PROBLEM_SUMMARIES.length];
        const applicant = applicants[i % applicants.length];
        const area = areas[i % areas.length];
        
        // Vary process type
        const processTypes = ['IN_PROGRESS', 'ADVICE', 'MEDIATION', 'DRAFTING'];
        const pType = processTypes[i % processTypes.length];

        const newCase = await ensureCase({
            problemSummary: `${summary} (Caso ${i+1})`,
            processType: pType as any,
            applicantId: applicant.identityCard,
            idNucleus: nucleus.idNucleus,
            term: semester.term,
            idLegalArea: area.idLegalArea,
            teacherId: teacher.identityCard,
            teacherTerm: teacher.term,
            idCourt: null
        });
        
        allCases.push(newCase);

        // Case Status
        await prisma.caseStatus.create({
            data: {
                idCase: newCase.idCase,
                statusNumber: 1,
                status: 'OPEN' as any,
                reason: 'Apertura de caso de prueba',
                userId: teacherUser.identityCard,
                registryDate: new Date()
            }
        });

        // Link beneficiary (cannot be the applicant)
        // We pick the next person in the applicants array to act as the beneficiary for this case
        const beneficiary = applicants[(i + 1) % applicants.length];

        const checkBen = await prisma.caseBeneficiary.findUnique({
             where: { idCase_beneficiaryId: { idCase: newCase.idCase, beneficiaryId: beneficiary.identityCard } }
        });
        
        if (!checkBen) {
            await prisma.caseBeneficiary.create({
                data: {
                    idCase: newCase.idCase,
                    beneficiaryId: beneficiary.identityCard,
                    relationship: 'Familiar',
                    type: 'DIRECT' as any,
                    description: 'Beneficiario directo del caso'
                }
            });
        }

        // Assign random student(s) - 1 or 2 per case
        const numberOfStudents = (i % 2) + 1; // 1 or 2
        for (let s = 0; s < numberOfStudents; s++) {
            // Pick a student via consistent hashing to make it deterministic if re-run, or semi-random.
            // (i + s) ensures distribution.
            const studentIndex = (i + s) % students.length;
            const student = students[studentIndex];
            
            const existingAssignment = await prisma.assignedStudent.findUnique({
                where: {
                    idCase_studentId_term: {
                        idCase: newCase.idCase,
                        studentId: student.identityCard,
                        term: student.term
                    }
                }
            });

            if (!existingAssignment) {
                await prisma.assignedStudent.create({
                    data: {
                        idCase: newCase.idCase,
                        studentId: student.identityCard,
                        term: student.term
                    }
                });
            }
        }
    }

    console.log('Agregando acciones aleatorias a 3 casos...');
    // Pick 3 random cases (e.g. index 0, 5, 10 or random)
    const casesWithActions = [allCases[0], allCases[5], allCases[10]];
    
    for (const c of casesWithActions) {
        if(!c) continue;
        const numActions = Math.floor(Math.random() * 5) + 3; // 3 to 7 actions
        
        for(let j=1; j<=numActions; j++) {
            const actionDesc = ACTION_PHRASES[Math.floor(Math.random() * ACTION_PHRASES.length)];
            
            // Avoid duplicate action numbers if re-running
            const existingAction = await prisma.caseAction.findUnique({
                where: { idCase_actionNumber: { idCase: c.idCase, actionNumber: j } }
            });

            if (!existingAction) {
                await prisma.caseAction.create({
                    data: {
                        idCase: c.idCase,
                        actionNumber: j,
                        description: actionDesc,
                        notes: 'Nota generada automáticamente para pruebas.',
                        userId: teacherUser.identityCard, // Actions done by teacher for simplicity
                        registryDate: new Date()
                    }
                });
            }
        }
    }

    console.log('✅ Carga de datos completada exitosamente!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
