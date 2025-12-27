import { PrismaClient, UserType, Gender, TeacherType, StudentType, BeneficiaryType, IdType, MaritalStatus, ProcessType, CaseStatusEnum } from '../src/generated/client.js';
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

async function main() {
    console.log('🌱 Starting seeding...');

    console.log("Seeding housing characteristics and options");
    const characteristicsData = [
        {
            name: 'Material del piso',
            options: ['Tierra', 'Cemento', 'Cerámica', 'Granito / Parquet / Mármol'],
        },
        {
            name: 'Material de las paredes',
            options: ['Cartón / Palma / Desechos', 'Bahareque', 'Bloque sin frizar', 'Bloque frizado'],
        },
        {
            name: 'Material del techo',
            options: ['Madera / Cartón / Palma', 'Zinc / Acerolit', 'Platabanda / Tejas'],
        },
        {
            name: 'Servicio de agua potable',
            options: ['Dentro de la vivienda', 'Fuera de la vivienda', 'No tiene servicio'],
        },
        {
            name: 'Servicio de aseo',
            options: ['Llega a la vivienda', 'No llega a la vivienda / Container', 'No tiene'],
        },
        {
            name: 'Eliminacion de excretas (aguas negras)',
            options: ['Poceta a cloaca / Pozo séptico', 'Poceta sin conexión (tubo)', 'Excusado de hoyo o letrina', 'No tiene']
        },
        {
            name: 'Tipo de Vivienda',
            options: ['Quinta / Casa Urb.', 'Apartamento', 'Bloque', 'Casa de Barrio', 'Casa rural', 'Rancho', 'Refugio', 'Otros']
        },
        {
            name: 'Artefactos Domesticos, bienes o servicios del hogar',
            options: ['Nevera', 'Lavadora', 'Computadora', 'Cable Satelital', 'Internet', 'Carro', 'Moto']
        },
    ];

    for (const charItem of characteristicsData) {
        const characteristic = await prisma.housingCharacteristic.upsert({
            where: { name: charItem.name },
            update: {},
            create: {
                name: charItem.name,
                isActive: true,
            },
        });
        console.log('Housing characteristic synced:', characteristic.name);
        let detailCounter = 1;
        for (const optionName of charItem.options) {
            await prisma.characteristicDetail.upsert({
                where: {
                    idCharacteristic_option: { // Asegúrate que tu UNIQUE en schema sea [idCharacteristic, option]
                        idCharacteristic: characteristic.idCharacteristic,
                        option: optionName
                    }
                },
                update: {},
                create: {
                    idCharacteristic: characteristic.idCharacteristic,
                    detailNumber: detailCounter++,
                    option: optionName
                }
            });
        }
    }

    const educationLevelData = [
        {
            name: 'Sin nivel',
            isActive: true,
        },
        {
            name: 'Primaria (primer grado)',
            isActive: true,
        },
        {
            name: 'Primaria (segundo grado)',
            isActive: true,
        },
        {
            name: 'Primaria (tercer grado)',
            isActive: true,
        },
        {
            name: 'Primaria (cuarto grado)',
            isActive: true,
        },
        {
            name: 'Primaria (quinto grado)',
            isActive: true,
        },
        {
            name: 'Primaria (sexto grado)',
            isActive: true,
        },
        {
            name: 'Básica (1er año / 7mo grado)',
            isActive: true,
        },
        {
            name: 'Básica (2do año / 8mo grado)',
            isActive: true,
        },
        {
            name: 'Básica (3er año / 9no grado)',
            isActive: true,
        },
        {
            name: 'Media Diversificada (4to año)',
            isActive: true,
        },
        {
            name: 'Media Diversificada (5to año)',
            isActive: true,
        },
        {
            name: 'Técnico Medio',
            isActive: true,
        },
        {
            name: 'Técnico Superior',
            isActive: true,
        },
        {
            name: 'Universitaria',
            isActive: true,
        },

    ];

    for (const levelItem of educationLevelData) {
        const level = await prisma.educationLevel.upsert({
            where: { name: levelItem.name },
            update: {},
            create: {
                name: levelItem.name,
                isActive: levelItem.isActive,
            },
        });
        console.log('Education level synced:', level.name);
    }

    const workConditionData = [
        {
            name: 'Patrono',
            isActive: true,
        },
        {
            name: 'Empleado',
            isActive: true,
        },
        {
            name: 'Obrero',
            isActive: true,
        },
        {
            name: 'Cuenta Propia',
            isActive: true,
        },
    ];

    for (const conditionItem of workConditionData) {
        const condition = await prisma.workCondition.upsert({
            where: { name: conditionItem.name },
            update: {},
            create: {
                name: conditionItem.name,
                isActive: conditionItem.isActive,
            },
        });
        console.log('Work condition synced:', condition.name);
    }
    
    const activityConditionData = [
        {
            name: 'Ama de casa',
            isActive: true,
        },
        {
            name: 'Estudiante',
            isActive: true,
        },
        {
            name: 'Pensionado / Jubilado',
            isActive: true,
        },
        {
            name: 'Otra',
            isActive: true,
        },
    ];

    for (const conditionItem of activityConditionData) {
        const condition = await prisma.activityCondition.upsert({
            where: { name: conditionItem.name },
            update: {},
            create: {
                name: conditionItem.name,
                isActive: conditionItem.isActive,
            },
        });
        console.log('Activity condition synced:', condition.name);
    }


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
