import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '#src/generated/client.js';

const connectionString = `${process.env.DATABASE_URL}`;
if (!connectionString) {
    throw new Error('DATABASE_URL no está configurado');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {

    console.log('🌱 Starting seeding....');

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

    console.log('Seeding courts');
    const courtSubjects = [
        'Civil',
        'Penal',
        'Agrario',
        'Contencioso Administrativo',
        'Protección de niños, niñas y adolescentes',
        'Laboral',
    ];

    for (const subject of courtSubjects) {
        const existing = await prisma.court.findFirst({ where: { subject } });
        if (existing) {
            if (!existing.isActive) {
                await prisma.court.update({
                    where: { idCourt: existing.idCourt },
                    data: { isActive: true },
                });
            }
            console.log('Court synced:', existing.subject);
            continue;
        }

        const created = await prisma.court.create({
            data: {
                subject,
                isActive: true,
            },
        });
        console.log('Court created:', created.subject);
    }


    console.log('✅ Seeding completed!');

    /**
     * Datos de las materias con las categoria de las materias y el Ambito Legal
     */

    const subjectsData = [
        {
            name: 'Materia Civil',
            categories: [
                {
                    name: 'Personas',
                    legalAreas: ['Rectificación de Actas', 'Inserción de Actas', 'Solicitud de Naturalización', 'Justificativo de Soltería', 'Justificativo de Concubinato', 'Invitación al país', 'Justificativo de Dependencia Económica / Pobreza', 'Declaración Jurada de No Poseer', 'Declaración Jurada de Ingresos', 'Concubinato Postmortem', 'Declaración Jurada', 'Justificativo de Testigos']
                },
                {
                    name: 'Bienes',
                    legalAreas: ['Título Supletorio', 'Compra venta bienhechuría', 'Partición de comunidad ordinaria', 'Propiedad Horizontal', 'Cierre de Titularidad', 'Aclaratoria']
                },
                {
                    name: 'Contratos',
                    legalAreas: ['Arrendamiento / Comodato', 'Compra - venta de bienes inmuebles', 'Compra - venta bienes muebles (vehículos)', 'Opción de Compra Venta', 'Finiquito de compra venta', 'Asociaciones / Fundaciones', 'Cooperativas', 'Poder', 'Cosión de derechos', 'Cobro de Bolívares', 'Constitución y liquidación de hipoteca', 'Servicios / obras']
                },
                {
                    name: 'Familia - Tribunales Ordinarios',
                    legalAreas: ['Divorcio por separación de hechos (185-A)', 'Separación de Cuerpos (189)', 'Conversión de separación en divorcio', 'Divorcio contencioso', 'Partición de comunidad conyugal', 'Partición de comunidad concubinaria', 'Capitulaciones matrimoniales', 'Divorcio Causal No Taxativa Sentencias']
                },
                {
                    name: 'Familia - Tribunales Protecc. Niños y Adolescentes',
                    legalAreas: ['Divorcio por separación de hechos (185-A)', 'Separación de Cuerpos (189)', 'Conversión de separación en divorcio', 'Divorcio contencioso', 'Reconocimiento Voluntario Hijo', 'Colocación familiar', 'Curatela', 'Medidas de proteccion (Identidad, salud, educación, otros)', 'Autorización para Viajar', 'Autorización para Vender', 'Autorización para Trabajar', 'Obligación de Manutención / Convivencia Familiar', 'Rectificación de Actas', 'Inserción de Actas', 'Carga Familiar', 'Cambio de Residencia', 'Ejercicio Unilateral de Patria Potestad', 'Divorcio Causal No Taxativa Sentencias', 'Tutela']
                },
                {
                    name: 'Sucesiones',
                    legalAreas: ['Cesión de derechos sucesorales', 'Justificativo Únicos y Universales herederos', 'Testamento', 'Declaración Sucesoral', 'Partición de comunidad hereditaria']
                }
            ]
        },
        {
            name: 'Materia Penal',
            categories: [
                {
                    name: 'General',
                    legalAreas: ['Delitos Contra la Propiedad (Robo, Hurto)', 'Contra las Personas (homicidio, lesiones)', 'Contra las Buenas Costumbres (Violación)', 'Delitos contra el Honor', 'Violencia Doméstica']

                }
            ]
        },
        {
            name: 'Materia Laboral',
            categories: [
                {
                    name: 'General',
                    legalAreas: ['Calificación de Despido', 'Prestaciones Sociales', 'Contratos de Trabajo', 'Accidentes de Trabajo', 'Incapacidad Laboral', 'Terminación de Relación Laboral']
                }
            ]
        },
        {
            name: 'Materia Mercantil',
            categories: [
                {
                    name: 'General',
                    legalAreas: ['Firma Personal', 'Constitución de Compañías', 'Actas de Asamblea', 'Compra Venta de Fondo de Comercio / Acciones', 'Letras de Cambio']
                }
            ]
        },
        {
            name: 'Materia Administrativa',
            categories: [
                {
                    name: 'General',
                    legalAreas: ['Recursos Administrativos']
                }
            ]
        },
        {
            name: 'Otros',
            categories: [
                {
                    name: 'General',
                    legalAreas: ['Convivencia Ciudadana', 'Derechos Humanos', 'Tránsito', 'Otros', 'Diligencias Seguimiento']
                }
            ]
        },
    ];

    for (const subjectItem of subjectsData) {
        // 1. Crear Materia
        const subject = await prisma.subject.upsert({
            where: { name: subjectItem.name },
            update: {},
            create: {
                name: subjectItem.name,
                isActive: true,
            },
        });
        console.log('📘 Subject synced:', subject.name);

        let categoryCounter = 1;
        for (const catItem of subjectItem.categories) {
            // 2. Crear Categoría
            const category = await prisma.subjectCategory.upsert({
                where: {
                    idSubject_name: {
                        idSubject: subject.idSubject,
                        name: catItem.name
                    }
                },
                update: {},
                create: {
                    idSubject: subject.idSubject,
                    categoryNumber: categoryCounter++,
                    name: catItem.name,
                    isActive: true
                }
            });
            // console.log(`   📂 Category synced: ${category.name}`);

            // 3. Crear Áreas Legales (Hijxs de la Categoría)
            // Aquí referenciamos la FK usando los IDs que acabamos de obtener (category.idSubject y category.categoryNumber)
            for (const areaName of catItem.legalAreas) {
                await prisma.legalArea.upsert({
                    where: {
                        idSubject_categoryNumber_name: {
                            idSubject: category.idSubject,
                            categoryNumber: category.categoryNumber,
                            name: areaName
                        }
                    },
                    update: {},
                    create: {
                        idSubject: category.idSubject,
                        categoryNumber: category.categoryNumber,
                        name: areaName,
                        isActive: true
                    }
                });
            }
        }
    }

    // Datos de Estados, Municipios y Parroquias
    const locationData = [
        {
            name: 'Bolívar',
            municipalities: [
                {
                    name: 'Angostura',
                    parishes: ['Sección Capital Raúl Leoni', 'Barceloneta', 'Santa Bárbara', 'San Francisco']
                },
                {
                    name: 'Caroní',
                    parishes: ['Cachamay', 'Chirica', 'Dalla Costa', 'Once de Abril', 'Simón Bolívar', 'Unare', 'Universidad', 'Vista al Sol', 'Pozo Verde', 'Yocoima', 'Cinco de Julio']
                },
                {
                    name: 'Cedeño',
                    parishes: ['Altagracia', 'Ascensión Farreras', 'Caicara del Orinoco', 'Guaniamo', 'La Urbana', 'Pijiguaos']
                },
                {
                    name: 'Chien',
                    parishes: ['El Palmar']
                },
                {
                    name: 'El Callao',
                    parishes: ['El Callao']
                },
                {
                    name: 'Gran Sabana',
                    parishes: ['Santa Elena de Uairén', 'Ikabarú']
                },
                {
                    name: 'Angostura del Orinoco',
                    parishes: ['Agua Salada', 'Catedral', 'José Antonio Páez', 'La Sabanita', 'Vista Hermosa', 'Marhuanta', 'Orinoco', 'Panapana', 'Zea']
                },
                {
                    name: 'Piar',
                    parishes: ['Andrés Eloy Blanco', 'Pedro Cova', 'Upata']
                },
                {
                    name: 'Roscio',
                    parishes: ['Salom', 'Seccion Capital Roscio']
                },
                {
                    name: 'Sifontes',
                    parishes: ['Tumeremo', 'Dalla Costa', 'San Isidro']
                },
                {
                    name: 'Sucre',
                    parishes: ['Aripao', 'Guarataro', 'Las Majadas', 'Moitaco', 'Sección Capital Sucre']
                },
            ]
        },
        {
            name: 'Distrito Capital',
            municipalities: [
                {
                    name: 'Libertador',
                    parishes: [
                        'Santa Rosalía', 'El Valle', 'Coche', 'Caricuao', 'Macarao',
                        'Antímano', 'La Vega', 'El Paraíso', 'El Junquito', 'Sucre',
                        'San Juan', 'Santa Teresa', '23 de enero', 'La Pastora',
                        'Altagracia', 'San José', 'San Bernardino', 'Catedral',
                        'La Candelaria', 'San Agustín', 'El Recreo', 'San Pedro'
                    ]
                }
            ]
        },
        {
            name: 'Miranda',
            municipalities: [
                { name: 'Guaicaipuro', parishes: [] },
                { name: 'Carrizal', parishes: [] },
                { name: 'Los Salias', parishes: [] },
                { name: 'Chacao', parishes: [] },
                { name: 'Sucre', parishes: [] },
                { name: 'Baruta', parishes: [] },
                { name: 'El Hatillo', parishes: [] },
                { name: 'Plaza', parishes: [] },
                { name: 'Zamora', parishes: [] },
                { name: 'Acevedo', parishes: [] },
                { name: 'Brión', parishes: [] },
                { name: 'Buroz', parishes: [] },
                { name: 'Andrés Bello', parishes: [] },
                { name: 'Páez', parishes: [] },
                { name: 'Pedro Gual', parishes: [] },
                { name: 'Paz Castillo', parishes: [] },
                { name: 'Independencia', parishes: [] },
                { name: 'Simón Bolívar', parishes: [] },
                { name: 'Tomás Lander', parishes: [] },
                { name: 'Cristóbal Rojas', parishes: [] },
                { name: 'Urdaneta', parishes: [] }
            ]
        },
        { name: 'Zulia', municipalities: [] },
        { name: 'Carabobo', municipalities: [] },
        { name: 'Lara', municipalities: [] },
        { name: 'Aragua', municipalities: [] },
        { name: 'Anzoátegui', municipalities: [] },
        { name: 'Táchira', municipalities: [] },
        { name: 'Falcón', municipalities: [] },
        { name: 'Sucre', municipalities: [] },
        { name: 'Monagas', municipalities: [] },
        { name: 'Portuguesa', municipalities: [] },
        { name: 'Barinas', municipalities: [] },
        { name: 'Mérida', municipalities: [] },
        { name: 'Guárico', municipalities: [] },
        { name: 'Trujillo', municipalities: [] },
        { name: 'Yaracuy', municipalities: [] },
        { name: 'Apure', municipalities: [] },
        { name: 'Nueva Esparta', municipalities: [] },
        { name: 'La Guaira', municipalities: [] },
        { name: 'Cojedes', municipalities: [] },
        { name: 'Delta Amacuro', municipalities: [] },
        { name: 'Amazonas', municipalities: [] },
        { name: 'Dependencias Federales', municipalities: [] }
    ];

    for (const stateItem of locationData) {
        const state = await prisma.state.upsert({
            where: { name: stateItem.name },
            update: {},
            create: { name: stateItem.name }
        });
        console.log('📍 State synced:', state.name);

        for (const munItem of stateItem.municipalities) {
            // Check if municipality already exists by name for this state
            let existingMun = await prisma.municipality.findUnique({
                where: {
                    idState_name: {
                        idState: state.idState,
                        name: munItem.name
                    }
                }
            });

            let munNumber: number;
            if (existingMun) {
                munNumber = existingMun.municipalityNumber;
            } else {
                // Find next available number
                const maxMun = await prisma.municipality.findFirst({
                    where: { idState: state.idState },
                    orderBy: { municipalityNumber: 'desc' },
                });
                munNumber = (maxMun?.municipalityNumber ?? 0) + 1;
            }

            const municipality = await prisma.municipality.upsert({
                where: {
                    idState_name: {
                        idState: state.idState,
                        name: munItem.name
                    }
                },
                update: {},
                create: {
                    idState: state.idState,
                    municipalityNumber: munNumber,
                    name: munItem.name
                }
            });
            console.log(`   🏙️ Municipality synced: ${municipality.name} (#${munNumber})`);

            for (const parishName of munItem.parishes) {
                // Check if parish already exists by name for this municipality
                let existingParish = await prisma.parish.findUnique({
                    where: {
                        idState_municipalityNumber_name: {
                            idState: municipality.idState,
                            municipalityNumber: municipality.municipalityNumber,
                            name: parishName
                        }
                    }
                });

                let pNumber: number;
                if (existingParish) {
                    pNumber = existingParish.parishNumber;
                } else {
                    // Find next available number
                    const maxParish = await prisma.parish.findFirst({
                        where: {
                            idState: municipality.idState,
                            municipalityNumber: municipality.municipalityNumber
                        },
                        orderBy: { parishNumber: 'desc' },
                    });
                    pNumber = (maxParish?.parishNumber ?? 0) + 1;
                }

                await prisma.parish.upsert({
                    where: {
                        idState_municipalityNumber_name: {
                            idState: municipality.idState,
                            municipalityNumber: municipality.municipalityNumber,
                            name: parishName
                        }
                    },
                    update: {},
                    create: {
                        idState: municipality.idState,
                        municipalityNumber: municipality.municipalityNumber,
                        parishNumber: pNumber,
                        name: parishName
                    }
                });
            }
        }
    }


}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
