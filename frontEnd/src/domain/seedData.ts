export const characteristicsData = [
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

export const educationLevelData = [
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

export const workConditionData = [
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
    {
        name: 'Buscando Trabajo',
        isActive: true,
    }
];

export const activityConditionData = [
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

export const servicesData = [
    { id: 1, name: 'Agua' },
    { id: 2, name: 'Electricidad' },
    { id: 3, name: 'Gas' },
    { id: 4, name: 'Aseo' },
    { id: 5, name: 'Internet' },
    { id: 6, name: 'Telefono' },
    { id: 7, name: 'Cloacas' },
];

export const courtSubjects = [
    'Civil',
    'Penal',
    'Agrario',
    'Contencioso Administrativo',
    'Protección de niños, niñas y adolescentes',
    'Laboral',
];

export const subjectsData = [
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

export const locationData = [
    {
        name: 'Amazonas',
        municipalities: [
            { name: 'Alto Orinoco', parishes: ['La Esmeralda', 'Huachamacare', 'Marawaka', 'Mavaca', 'Sierra Parima'] },
            { name: 'Atabapo', parishes: ['San Fernando de Atabapo', 'Ucata', 'Yapacana', 'Caname'] },
            { name: 'Atures', parishes: ['Fernando Girón Tovar', 'Luis Alberto Gómez', 'Parhueña', 'Platanillal'] },
            { name: 'Autana', parishes: ['Isla Ratón', 'Samariapo', 'Sipapo', 'Munduapo', 'Guayapo'] },
            { name: 'Manapiare', parishes: ['San Juan de Manapiare', 'Alto Ventuari', 'Medio Ventuari', 'Bajo Ventuari'] },
            { name: 'Maroa', parishes: ['Maroa', 'Victorino', 'Comunidad'] },
            { name: 'Río Negro', parishes: ['San Carlos de Río Negro', 'Solano', 'Casiquiare', 'Cocuy'] }
        ]
    },
    {
        name: 'Anzoátegui',
        municipalities: [
            { name: 'Anaco', parishes: ['Anaco', 'San Joaquín', 'Buena Vista'] },
            { name: 'Aragua', parishes: ['Aragua de Barcelona', 'Cachipo'] },
            { name: 'Diego Bautista Urbaneja', parishes: ['Lechería', 'El Morro'] },
            { name: 'Fernando de Peñalver', parishes: ['Puerto Píritu', 'San Miguel', 'Sucre'] },
            { name: 'Francisco del Carmen Carvajal', parishes: ['Valle de Guanape', 'Santa Bárbara'] },
            { name: 'Francisco de Miranda', parishes: ['Pariaguán', 'Atapirire', 'Boca del Pao', 'El Pao'] },
            { name: 'Guanta', parishes: ['Guanta', 'Chorrerón'] },
            { name: 'Independencia', parishes: ['Soledad', 'Mamo'] },
            { name: 'José Gregorio Monagas', parishes: ['Mapire', 'Piar', 'San Diego de Cabrutica', 'Santa Clara', 'Uverito', 'Zuata'] },
            { name: 'Juan Antonio Sotillo', parishes: ['Puerto La Cruz', 'Pozuelos'] },
            { name: 'Juan Manuel Cajigal', parishes: ['Onoto', 'San Pablo'] },
            { name: 'Libertad', parishes: ['San Mateo', 'El Carito', 'Santa Inés', 'La Romereña'] },
            { name: 'Manuel Ezequiel Bruzual', parishes: ['Clarines', 'Guanape', 'Sabana de Uchire'] },
            { name: 'Pedro María Freites', parishes: ['Cantaura', 'Libertador', 'Santa Rosa', 'Urica'] },
            { name: 'Píritu', parishes: ['Píritu', 'San Francisco'] },
            { name: 'San José de Guanipa', parishes: ['San José de Guanipa'] },
            { name: 'San Juan de Capistrano', parishes: ['Boca de Uchire', 'Boca de Chávez'] },
            { name: 'Santa Ana', parishes: ['Santa Ana', 'Pueblo Nuevo'] },
            { name: 'Simón Bolívar', parishes: ['Barcelona', 'Bergantín', 'Caigua', 'El Carmen', 'El Pilar', 'Naricual', 'San Cristóbal'] },
            { name: 'Simón Rodríguez', parishes: ['Edmundo Barrios', 'Miguel Otero Silva'] },
            { name: 'Sir Arthur McGregor', parishes: ['El Chaparro', 'Tomás Alfaro Calatrava'] }
        ]
    },
    {
        name: 'Apure',
        municipalities: [
            { name: 'Achaguas', parishes: ['Achaguas', 'Apurito', 'El Yagual', 'Guachara', 'Mucuritas', 'Queseras del Medio'] },
            { name: 'Biruaca', parishes: ['Biruaca'] },
            { name: 'Muñoz', parishes: ['Bruzual', 'Mantecal', 'Quintero', 'Rincón Hondo', 'San Vicente'] },
            { name: 'Páez', parishes: ['Guasdualito', 'Aramendi', 'El Amparo', 'San Camilo', 'Urdaneta'] },
            { name: 'Pedro Camejo', parishes: ['San Juan de Payara', 'Codazzi', 'Cunaviche'] },
            { name: 'Rómulo Gallegos', parishes: ['Elorza', 'La Trinidad'] },
            { name: 'San Fernando', parishes: ['San Fernando', 'El Recreo', 'Peñalver', 'San Rafael de Atamaica'] }
        ]
    },
    {
        name: 'Aragua',
        municipalities: [
            { name: 'Bolívar', parishes: ['San Mateo'] },
            { name: 'Camatagua', parishes: ['Camatagua', 'Carmen de Cura'] },
            { name: 'Francisco Linares Alcántara', parishes: ['Santa Rita', 'Francisco de Miranda', 'Monseñor Feliciano González'] },
            { name: 'Girardot', parishes: ['Pedro José Ovalles', 'Joaquín Crespo', 'José Casanova Godoy', 'Madre María de San José', 'Andrés Eloy Blanco', 'Los Tacarigua', 'Las Delicias', 'Choroní'] },
            { name: 'José Ángel Lamas', parishes: ['Santa Cruz'] },
            { name: 'José Félix Ribas', parishes: ['La Victoria', 'Castor Nieves Ríos', 'Las Guacamayas', 'Pao de Zárate', 'Zuata'] },
            { name: 'José Rafael Revenga', parishes: ['El Consejo'] },
            { name: 'Libertador', parishes: ['Palo Negro', 'San Martín de Porres'] },
            { name: 'Mario Briceño Iragorry', parishes: ['El Limón', 'Caña de Azúcar'] },
            { name: 'Ocumare de la Costa de Oro', parishes: ['Ocumare de la Costa'] },
            { name: 'San Casimiro', parishes: ['San Casimiro', 'Güiripa', 'Ollas de Caramacate'] },
            { name: 'San Sebastián', parishes: ['San Sebastián'] },
            { name: 'Santiago Mariño', parishes: ['Turmero', 'Arévalo Aponte', 'Chuao', 'Samán de Güere', 'Alfredo Pacheco Miranda'] },
            { name: 'Santos Michelena', parishes: ['Santos Michelena', 'Tiara'] },
            { name: 'Sucre', parishes: ['Cagua', 'Bella Vista'] },
            { name: 'Tovar', parishes: ['Colonia Tovar'] },
            { name: 'Urdaneta', parishes: ['Barbacoas', 'Las Peñas', 'San Francisco de Cara', 'Taguay'] },
            { name: 'Zamora', parishes: ['Villa de Cura', 'San Francisco de Asís', 'Valles de Tucutunemo', 'Augusto Mijares'] }
        ]
    },
    {
        name: 'Barinas',
        municipalities: [
            { name: 'Alberto Arvelo Torrealba', parishes: ['Sabaneta', 'Rodríguez Domínguez'] },
            { name: 'Andrés Eloy Blanco', parishes: ['El Cantón', 'Santa Cruz de Guaca', 'Puerto Vivas'] },
            { name: 'Antonio José de Sucre', parishes: ['Ticoporo', 'Nicolás Pulido', 'Andrés Bello'] },
            { name: 'Arismendi', parishes: ['Arismendi', 'Guadarrama', 'La Unión', 'San Antonio'] },
            { name: 'Barinas', parishes: ['Barinas', 'Alfredo Arvelo Larriva', 'San Silvestre', 'Santa Inés', 'Santa Lucía', 'Torunos', 'El Carmen', 'Rómulo Betancourt', 'Corazón de Jesús', 'Ramón Ignacio Méndez', 'Alto Barinas', 'Manuel Palacio Fajardo', 'Juan Antonio Rodríguez Domínguez', 'Dominga Ortiz de Páez'] },
            { name: 'Bolívar', parishes: ['Barinitas', 'Altamira de Cáceres', 'Calderas'] },
            { name: 'Cruz Paredes', parishes: ['Barrancas', 'Masparrito', 'El Socorro'] },
            { name: 'Ezequiel Zamora', parishes: ['Santa Bárbara', 'Pedro Briceño Méndez', 'Ramón Ignacio Méndez', 'José Ignacio del Pumar'] },
            { name: 'Obispos', parishes: ['Obispos', 'El Real', 'La Luz', 'Los Guasimitos'] },
            { name: 'Pedraza', parishes: ['Ciudad Bolivia', 'Ignacio Briceño', 'José Félix Ribas', 'Páez'] },
            { name: 'Rojas', parishes: ['Libertad', 'Dolores', 'Santa Rosa', 'Simón Rodríguez', 'Palacio Fajardo'] },
            { name: 'Sosa', parishes: ['Ciudad de Nutrias', 'El Regalo', 'Puerto Nutrias', 'Santa Catalina', 'Simón Bolívar'] }
        ]
    },
    {
        name: 'Bolívar',
        municipalities: [
            { name: 'Angostura del Orinoco', parishes: ['Catedral', 'Zea', 'Orinoco', 'José Antonio Páez', 'Marhuanta', 'Agua Salada', 'Vista Hermosa', 'La Sabanita', 'Panapana'] },
            { name: 'Caroní', parishes: ['Cachamay', 'Chirica', 'Dalla Costa', 'Once de Abril', 'Simón Bolívar', 'Unare', 'Universidad', 'Vista al Sol', 'Pozo Verde', 'Yocoima', '5 de Julio'] },
            { name: 'Cedeño', parishes: ['Caicara del Orinoco', 'Altagracia', 'Ascensión Farreras', 'Guaniamo', 'La Urbana', 'Pijiguaos'] },
            { name: 'Chien', parishes: ['Padre Pedro Chien'] },
            { name: 'El Callao', parishes: ['El Callao'] },
            { name: 'Gran Sabana', parishes: ['Santa Elena de Uairén', 'Ikabarú'] },
            { name: 'Piar', parishes: ['Upata', 'Andrés Eloy Blanco', 'Pedro Cova'] },
            { name: 'Roscio', parishes: ['Guasipati', 'Salom'] },
            { name: 'Sifontes', parishes: ['Tumeremo', 'Dalla Costa', 'San Isidro'] },
            { name: 'Sucre', parishes: ['Maripa', 'Aripao', 'Guarataro', 'Las Majadas', 'Moitaco'] },
            { name: 'Angostura', parishes: ['Ciudad Piar', 'San Francisco', 'Barceloneta', 'Santa Bárbara'] }
        ]
    },
    {
        name: 'Carabobo',
        municipalities: [
            { name: 'Bejuma', parishes: ['Bejuma', 'Canoabo', 'Simón Bolívar'] },
            { name: 'Carlos Arvelo', parishes: ['Güigüe', 'Belén', 'Tacarigua'] },
            { name: 'Diego Ibarra', parishes: ['Mariara', 'Aguas Calientes'] },
            { name: 'Guacara', parishes: ['Guacara', 'Ciudad Alianza', 'Yagua'] },
            { name: 'Juan José Mora', parishes: ['Morón', 'Urama'] },
            { name: 'Libertador', parishes: ['Tocuyito', 'Independencia'] },
            { name: 'Los Guayos', parishes: ['Los Guayos'] },
            { name: 'Miranda', parishes: ['Miranda'] },
            { name: 'Montalbán', parishes: ['Montalbán'] },
            { name: 'Naguanagua', parishes: ['Naguanagua'] },
            { name: 'Puerto Cabello', parishes: ['Puerto Cabello', 'Democracia', 'Fraternidad', 'Goaigoaza', 'Juan José Flores', 'Patanemo', 'Salom', 'Bartolomé Salóm'] },
            { name: 'San Diego', parishes: ['San Diego'] },
            { name: 'San Joaquín', parishes: ['San Joaquín'] },
            { name: 'Valencia', parishes: ['Socorro', 'San Blas', 'Catedral', 'Candelaria', 'San José', 'Santa Rosa', 'Rafael Urdaneta', 'Miguel Peña', 'Negro Primero'] }
        ]
    },
    {
        name: 'Cojedes',
        municipalities: [
            { name: 'Anzoátegui', parishes: ['Cojedes', 'Juan de Dios Melean'] },
            { name: 'Ezequiel Zamora', parishes: ['San Carlos', 'Juan Ángel Bravo', 'Manuel Manrique'] },
            { name: 'Girardot', parishes: ['El Baúl', 'Sucre'] },
            { name: 'Lima Blanco', parishes: ['Macapo', 'La Aguadita'] },
            { name: 'Pao de San Juan Bautista', parishes: ['El Pao'] },
            { name: 'Ricaurte', parishes: ['Libertad', 'Monagas'] },
            { name: 'Rómulo Gallegos', parishes: ['Las Vegas'] },
            { name: 'Tinaco', parishes: ['Tinaco'] },
            { name: 'Tinaquillo', parishes: ['Tinaquillo'] }
        ]
    },
    {
        name: 'Delta Amacuro',
        municipalities: [
            { name: 'Antonio Díaz', parishes: ['Curiapo', 'Almirante Luis Brión', 'Francisco Aniceto Lugo', 'Manuel Renaud', 'Padre Barral', 'Santos de Abelgas'] },
            { name: 'Casacoima', parishes: ['Imataca', 'Juan Bautista Arismendi', 'Manuel Piar', 'Rómulo Gallegos'] },
            { name: 'Pedernales', parishes: ['Pedernales', 'Luis Beltrán Prieto Figueroa'] },
            { name: 'Tucupita', parishes: ['San José', 'José Vidal Marcano', 'Leonardo Ruiz Pineda', 'Mariscal Antonio José de Sucre', 'Monseñor Argimiro García', 'Virgen del Valle', 'San Rafael', 'Juan Millán'] }
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
        name: 'Falcón',
        municipalities: [
            { name: 'Acosta', parishes: ['San Juan de los Cayos', 'Capadare', 'La Pastora', 'Libertador'] },
            { name: 'Bolívar', parishes: ['San Luis', 'Aracua', 'La Peña'] },
            { name: 'Buchivacoa', parishes: ['Capatárida', 'Bariro', 'Borojó', 'Guajiro', 'Seque', 'Valle de Eroa', 'Zazárida'] },
            { name: 'Cacique Manaure', parishes: ['Yaracal'] },
            { name: 'Carirubana', parishes: ['Carirubana', 'Norte', 'Punta Cardón', 'Santa Ana'] },
            { name: 'Colina', parishes: ['La Vela de Coro', 'Acurigua', 'Guaibacoa', 'Las Calderas', 'Mataruca'] },
            { name: 'Dabajuro', parishes: ['Dabajuro'] },
            { name: 'Democracia', parishes: ['Pedregal', 'Agua Larga', 'Acurigua', 'Purureche', 'San Félix'] },
            { name: 'Falcón', parishes: ['Pueblo Nuevo', 'Adícora', 'Baraived', 'Buena Vista', 'Jadacaquiva', 'Moruy', 'El Hato', 'Adaure'] },
            { name: 'Federación', parishes: ['Churuguara', 'Agua Larga', 'El Paují', 'Independencia', 'Mapararí'] },
            { name: 'Jacura', parishes: ['Jacura', 'Agua Salada', 'Araurima'] },
            { name: 'José Laurencio Silva', parishes: ['Chichiriviche', 'Tocuyo de la Costa'] },
            { name: 'Los Taques', parishes: ['Santa Cruz de Los Taques', 'Judibana'] },
            { name: 'Mauroa', parishes: ['Mene de Mauroa', 'Casigua', 'San Félix'] },
            { name: 'Miranda', parishes: ['Santa Ana de Coro', 'Guzmán Guillermo', 'Mitare', 'Río Seco', 'Sabaneta', 'San Antonio', 'San Gabriel'] },
            { name: 'Monseñor Iturriza', parishes: ['Chichiriviche', 'Boca de Aroa', 'San José de la Costa'] },
            { name: 'Palmasola', parishes: ['Palmasola'] },
            { name: 'Petit', parishes: ['Cabure', 'Colina', 'Curimagua'] },
            { name: 'Píritu', parishes: ['Píritu', 'San José de la Costa'] },
            { name: 'San Francisco', parishes: ['Mirimire'] },
            { name: 'Sucre', parishes: ['La Cruz de Taratara', 'Pecaya'] },
            { name: 'Tocópero', parishes: ['Tocópero'] },
            { name: 'Unión', parishes: ['Santa Cruz de Bucaral', 'El Charal', 'Las Vegas del Tuy'] },
            { name: 'Urumaco', parishes: ['Urumaco', 'Bruzual'] },
            { name: 'Zamora', parishes: ['Puerto Cumarebo', 'La Ciénaga', 'La Soledad', 'Pueblo Cumarebo', 'Zazárida'] }
        ]
    },
    {
        name: 'Guárico',
        municipalities: [
            { name: 'Camaguán', parishes: ['Camaguán', 'Puerto Miranda', 'Uverito'] },
            { name: 'Chaguaramas', parishes: ['Chaguaramas'] },
            { name: 'El Socorro', parishes: ['El Socorro'] },
            { name: 'Francisco de Miranda', parishes: ['Calabozo', 'El Calvario', 'El Rastro', 'Guardatinajas'] },
            { name: 'José Félix Ribas', parishes: ['Tucupido', 'San Rafael de Laya'] },
            { name: 'José Tadeo Monagas', parishes: ['Altagracia de Orituco', 'Lezama', 'Libertad de Orituco', 'Paso Real de Macaira', 'San Francisco de Macaira', 'San Rafael de Orituco', 'Soublette'] },
            { name: 'Juan Germán Roscio', parishes: ['San Juan de los Morros', 'Cantagallo', 'Parapara'] },
            { name: 'Juan José Rondón', parishes: ['Las Mercedes del Llano', 'Cabruta', 'Santa Rita de Manapire'] },
            { name: 'Julián Mellado', parishes: ['El Sombrero', 'Sosa'] },
            { name: 'Leonardo Infante', parishes: ['Valle de la Pascua', 'Espino'] },
            { name: 'Ortiz', parishes: ['Ortiz', 'Palo Seco', 'San Francisco de Tiznados', 'San José de Tiznados'] },
            { name: 'San Gerónimo de Guayabal', parishes: ['Guayabal', 'Cazorla'] },
            { name: 'San José de Guaribe', parishes: ['San José de Guaribe'] },
            { name: 'Santa María de Ipire', parishes: ['Santa María de Ipire', 'Altamira'] },
            { name: 'Zaraza', parishes: ['Zaraza', 'San José de Unare'] }
        ]
    },
    {
        name: 'La Guaira',
        municipalities: [
            { name: 'Vargas', parishes: ['Caraballeda', 'Carayaca', 'Carlos Soublette', 'Caruao', 'Catia La Mar', 'El Junko', 'La Guaira', 'Macuto', 'Maiquetía', 'Naiguatá', 'Urimare'] }
        ]
    },
    {
        name: 'Lara',
        municipalities: [
            { name: 'Andrés Eloy Blanco', parishes: ['Sanare', 'Quebrada Honda del Guache', 'Pío Tamayo'] },
            { name: 'Crespo', parishes: ['Duaca', 'Freitez', 'José María Blanco'] },
            { name: 'Iribarren', parishes: ['Catedral', 'Concepción', 'Santa Rosa', 'Unión', 'Juan de Villegas', 'Aguedo Felipe Alvarado', 'Buena Vista', 'El Cuji', 'Juares', 'Tamaca'] },
            { name: 'Jiménez', parishes: ['Quíbor', 'Coronel Mariano Peraza', 'Diego de Lozada', 'José Bernardo Dorante', 'Juan Bautista Rodríguez', 'Paraíso de San José', 'San Miguel', 'Tintorero'] },
            { name: 'Morán', parishes: ['El Tocuyo', 'Anzoátegui', 'Bolívar', 'Guárico', 'Hilario Luna y Luna', 'Humocaro Alto', 'Humocaro Bajo', 'La Candelaria', 'Morán'] },
            { name: 'Palavecino', parishes: ['Cabudare', 'José Gregorio Bastidas', 'Agua Viva'] },
            { name: 'Simón Planas', parishes: ['Sarare', 'Gustavo Vegas León', 'Buría'] },
            { name: 'Torres', parishes: ['Carora', 'Altagracia', 'Antonio Díaz', 'Camacaro', 'Castañeda', 'Chiquinquirá', 'El Blanco', 'Espinoza de los Monteros', 'Heriberto Arroyo', 'Lara', 'Las Mercedes', 'Manuel Morillo', 'Montes de oca', 'Reyes Vargas', 'Torres', 'Trinidad Samuel'] },
            { name: 'Urdaneta', parishes: ['Siquisique', 'San Miguel', 'Xaguas', 'Las Mercedes'] }
        ]
    },
    {
        name: 'Mérida',
        municipalities: [
            { name: 'Alberto Adriani', parishes: ['Presidente Betancourt', 'Presidente Páez', 'Presidente Rómulo Gallegos', 'Gabriel Picón González', 'Héctor Amable Mora', 'José Nucete Sardi', 'Pulido Méndez'] },
            { name: 'Andrés Bello', parishes: ['La Azulita'] },
            { name: 'Antonio Pinto Salinas', parishes: ['Santa Cruz de Mora', 'Mesa Bolívar', 'Mesa de Las Palmas'] },
            { name: 'Aricagua', parishes: ['Aricagua', 'San Antonio'] },
            { name: 'Arzobispo Chacón', parishes: ['Canaguá', 'Capurí', 'Chacantá', 'El Molino', 'Guaimaral', 'Mucutuy', 'Mucuchachí'] },
            { name: 'Campo Elías', parishes: ['Ejido', 'José Buenaventura Vivas', 'Jají', 'La Mesa', 'Matriz', 'Montalbán', 'Acequias', 'San José del Sur'] },
            { name: 'Caracciolo Parra Olmedo', parishes: ['Tucaní', 'Florencio Ramírez'] },
            { name: 'Cardenal Quintero', parishes: ['Santo Domingo', 'Las Piedras'] },
            { name: 'Guaraque', parishes: ['Guaraque', 'Mesa de Quintero', 'Río Negro'] },
            { name: 'Julio César Salas', parishes: ['Arapuey', 'Palmira'] },
            { name: 'Justo Briceño', parishes: ['Torondoy', 'San Cristóbal de Torondoy'] },
            { name: 'Libertador', parishes: ['Antonio Spinetti Dini', 'Arias', 'Caracciolo Parra Pérez', 'Domingo Peña', 'El Llano', 'Gonzalo Picón Febres', 'Jacinto Plaza', 'Juan Rodríguez Suárez', 'Lasso de la Vega', 'Mariano Picón Salas', 'Milla', 'Osuna Rodríguez', 'Sagrario', 'El Morro', 'Los Nevados'] },
            { name: 'Miranda', parishes: ['Timotes', 'Andrés Eloy Blanco', 'Piñango', 'La Venta'] },
            { name: 'Obispo Ramos de Lora', parishes: ['Santa Elena de Arenales', 'Eloy Paredes', 'San Rafael de Alcázar'] },
            { name: 'Padre Noguera', parishes: ['Santa María de Caparo'] },
            { name: 'Pueblo Llano', parishes: ['Pueblo Llano'] },
            { name: 'Rangel', parishes: ['Mucuchíes', 'La Toma', 'Mucurubá', 'San Rafael', 'Cacute'] },
            { name: 'Rivas Dávila', parishes: ['Bailadores', 'Gerónimo Maldonado'] },
            { name: 'Santos Marquina', parishes: ['Tabay'] },
            { name: 'Sucre', parishes: ['Lagunillas', 'Chiguará', 'Estánquez', 'La Trampa', 'Pueblos del Sur', 'San Juan', 'Victoria'] },
            { name: 'Tovar', parishes: ['Tovar', 'El Llano', 'San Francisco', 'El Amparo'] },
            { name: 'Tulio Febres Cordero', parishes: ['Nueva Bolivia', 'Independencia', 'María de la Concepción Palacios Blanco', 'Santa Apolonia'] },
            { name: 'Zea', parishes: ['Zea', 'Caño El Tigre'] }
        ]
    },
    {
        name: 'Miranda',
        municipalities: [
            { name: 'Acevedo', parishes: ['Caucagua', 'Aragüita', 'Arévalo González', 'Capaya', 'El Café', 'Marizapa', 'Panaquire', 'Ribas'] },
            { name: 'Andrés Bello', parishes: ['San José de Barlovento', 'Cumbo'] },
            { name: 'Baruta', parishes: ['Nuestra Señora del Rosario de Baruta', 'El Cafetal', 'Las Minas de Baruta'] },
            { name: 'Brión', parishes: ['Higuerote', 'Curiepe', 'Tacarigua'] },
            { name: 'Buroz', parishes: ['Mamporal'] },
            { name: 'Carrizal', parishes: ['Carrizal'] },
            { name: 'Chacao', parishes: ['San José de Chacao'] },
            { name: 'Cristóbal Rojas', parishes: ['Charallave', 'Las Brisas'] },
            { name: 'El Hatillo', parishes: ['Santa Rosalía de Palermo'] },
            { name: 'Guaicaipuro', parishes: ['Los Teques', 'Altagracia de la Montaña', 'Cecilio Acosta', 'El Jarillo', 'Paracotos', 'San Pedro', 'Tácata'] },
            { name: 'Independencia', parishes: ['Santa Teresa del Tuy', 'Cartanal'] },
            { name: 'Lander', parishes: ['Ocumare del Tuy', 'La Democracia', 'Santa Bárbara'] },
            { name: 'Los Salias', parishes: ['San Antonio de los Altos'] },
            { name: 'Paez', parishes: ['Río Chico', 'El Guapo', 'Paparo', 'San Fernando del Guapo', 'Tacarigua de la Laguna'] },
            { name: 'Paz Castillo', parishes: ['Santa Lucía', 'Santa Rita'] },
            { name: 'Pedro Gual', parishes: ['Cúpira', 'Machurucuto'] },
            { name: 'Plaza', parishes: ['Guarenas'] },
            { name: 'Simón Bolívar', parishes: ['San Francisco de Yare', 'San Antonio de Yare'] },
            { name: 'Sucre', parishes: ['Petare', 'Caucagüita', 'Fila de Mariches', 'La Dolorita', 'Leoncio Martínez'] },
            { name: 'Urdaneta', parishes: ['Cúa', 'Nueva Cúa'] },
            { name: 'Zamora', parishes: ['Guatire', 'Bolívar'] }
        ]
    },
    {
        name: 'Monagas',
        municipalities: [
            { name: 'Acosta', parishes: ['San Antonio', 'San Francisco'] },
            { name: 'Aguasay', parishes: ['Aguasay'] },
            { name: 'Bolívar', parishes: ['Caripito'] },
            { name: 'Caripe', parishes: ['Caripe', 'El Guácharo', 'La Guanota', 'Sabana de Piedra', 'San Agustín', 'Teresén'] },
            { name: 'Cedeño', parishes: ['Caicara', 'Areo', 'San Félix', 'Viento Fresco'] },
            { name: 'Ezequiel Zamora', parishes: ['Punta de Mata', 'El Tejero'] },
            { name: 'Libertador', parishes: ['Temblador', 'Las Alhuacas', 'Chaguaramas', 'Tabasca'] },
            { name: 'Maturín', parishes: ['Maturín', 'Alto de Los Godos', 'Boquerón', 'El Corozo', 'El Furrial', 'Jusepín', 'La Pica', 'Las Cocuizas', 'San Simón', 'San Vicente', 'Santa Cruz'] },
            { name: 'Piar', parishes: ['Aragua', 'Aparicio', 'Chaguaramal', 'El Pinto', 'Guanaguana', 'La Toscana', 'Taguaya'] },
            { name: 'Punceres', parishes: ['Quiriquire', 'Cachipo'] },
            { name: 'Santa Bárbara', parishes: ['Santa Bárbara'] },
            { name: 'Sotillo', parishes: ['Barrancas', 'Los Barrancos de Fajardo'] },
            { name: 'Uracoa', parishes: ['Uracoa'] }
        ]
    },
    {
        name: 'Nueva Esparta',
        municipalities: [
            { name: 'Antolín del Campo', parishes: ['Antolín del Campo'] },
            { name: 'Arismendi', parishes: ['Arismendi'] },
            { name: 'Díaz', parishes: ['San Juan Bautista', 'Zabala'] },
            { name: 'García', parishes: ['García', 'Francisco Fajardo'] },
            { name: 'Gómez', parishes: ['Santa Ana', 'Bolívar', 'Guevara', 'Matasiete', 'Sucre'] },
            { name: 'Maneiro', parishes: ['Maneiro', 'Aguirre'] },
            { name: 'Marcano', parishes: ['Juan Griego', 'Adrián'] },
            { name: 'Mariño', parishes: ['Mariño'] },
            { name: 'Macanao', parishes: ['Boca de Río', 'San Francisco de Macanao'] },
            { name: 'Tubores', parishes: ['Punta de Piedras', 'Los Barales'] },
            { name: 'Villalba', parishes: ['San Pedro de Coche', 'Vicente Fuentes'] }
        ]
    },
    {
        name: 'Portuguesa',
        municipalities: [
            { name: 'Agua Blanca', parishes: ['Agua Blanca'] },
            { name: 'Araure', parishes: ['Araure', 'Río Acarigua'] },
            { name: 'Esteller', parishes: ['Píritu', 'Uveral'] },
            { name: 'Guanare', parishes: ['Guanare', 'Córdoba', 'San José de la Montaña', 'San Juan de Guanaguanare', 'Virgen de la Coromoto'] },
            { name: 'Guanarito', parishes: ['Guanarito', 'Trinidad de la Capilla', 'Divina Pastora'] },
            { name: 'Monseñor José Vicente de Unda', parishes: ['Chabasquén', 'Peña Blanca'] },
            { name: 'Ospino', parishes: ['Ospino', 'Aparición', 'La Estación'] },
            { name: 'Páez', parishes: ['Acarigua', 'Payara', 'Pimpinela', 'Ramón Peraza'] },
            { name: 'Papelón', parishes: ['Papelón', 'Caño Delgadito'] },
            { name: 'San Genaro de Boconoíto', parishes: ['Boconoíto', 'Antolín Tovar'] },
            { name: 'San Rafael de Onoto', parishes: ['San Rafael de Onoto', 'Santa Fe', 'San Roque'] },
            { name: 'Santa Rosalía', parishes: ['El Playón', 'Florida'] },
            { name: 'Sucre', parishes: ['Biscucuy', 'Concepción', 'San José de Saguaz', 'San Rafael de Palo Alzado', 'Uvencio Antonio Velásquez', 'Villa Rosa'] },
            { name: 'Turén', parishes: ['Villa Bruzual', 'Canelones', 'Santa Cruz', 'San Isidro Labrador'] }
        ]
    },
    {
        name: 'Sucre',
        municipalities: [
            { name: 'Andrés Eloy Blanco', parishes: ['Mariño', 'Rómulo Gallegos'] },
            { name: 'Andrés Mata', parishes: ['San José de Areocuar', 'Tavera Acosta'] },
            { name: 'Arismendi', parishes: ['Río Caribe', 'Antonio José de Sucre', 'El Morro de Puerto Santo', 'Puerto Santo', 'San Juan de las Galdonas'] },
            { name: 'Benítez', parishes: ['El Pilar', 'El Rincón', 'General Francisco Antonio Vázquez', 'Guaraúnos', 'Tunapuicito', 'Unión'] },
            { name: 'Bermúdez', parishes: ['Carúpano', 'Santa Catalina', 'Santa Rosa', 'Santa Teresa', 'Macarapana'] },
            { name: 'Bolívar', parishes: ['Marigüitar'] },
            { name: 'Cajigal', parishes: ['Yaguaraparo', 'El Paujil', 'Libertad'] },
            { name: 'Cruz Salmerón Acosta', parishes: ['Araya', 'Chacopata', 'Manicuare'] },
            { name: 'Libertador', parishes: ['Tunapuy', 'Campo Elías'] },
            { name: 'Mariño', parishes: ['Irapa', 'Campo Claro', 'Maripa'] },
            { name: 'Mejía', parishes: ['San Antonio del Golfo'] },
            { name: 'Montes', parishes: ['Cumanacoa', 'Arenas', 'Aricagua', 'Cocollar', 'San Fernando'] },
            { name: 'Ribero', parishes: ['Cariaco', 'Catuaro', 'Rómulo Gallegos', 'San Juan', 'Santa Cruz'] },
            { name: 'Sucre', parishes: ['Cumaná', 'Ayacucho', 'Gran Mariscal', 'Raúl Leoni', 'San Juan', 'Santa Inés', 'Valentín Valiente'] },
            { name: 'Valdez', parishes: ['Güiria', 'Bideau', 'Cristóbal Colón', 'Punta de Piedra'] }
        ]
    },
    {
        name: 'Táchira',
        municipalities: [
            { name: 'Andrés Bello', parishes: ['Cordero'] },
            { name: 'Antonio Rómulo Costa', parishes: ['Las Mesas'] },
            { name: 'Ayacucho', parishes: ['San Juan de Colón', 'Rivas Berti', 'San Pedro del Río'] },
            { name: 'Bolívar', parishes: ['San Antonio del Táchira', 'Juan Vicente Gómez', 'Isaías Medina Angarita', 'Palotal'] },
            { name: 'Cárdenas', parishes: ['Táriba', 'Amenodoro Rangel Lamús', 'La Florida'] },
            { name: 'Córdoba', parishes: ['Santa Ana del Táchira'] },
            { name: 'Fernández Feo', parishes: ['El Piñal', 'Alberto Adriani', 'Santo Domingo'] },
            { name: 'Francisco de Miranda', parishes: ['San José de Bolívar'] },
            { name: 'García de Hevia', parishes: ['La Fría', 'Boca de Grita', 'José Antonio Páez'] },
            { name: 'Guásimos', parishes: ['Palmira'] },
            { name: 'Independencia', parishes: ['Capacho Nuevo', 'Juan Germán Roscio', 'Román Cárdenas'] },
            { name: 'Jáuregui', parishes: ['La Grita', 'Emilio Constantino Guerrero', 'Monseñor Ricardo Casanova'] },
            { name: 'José María Vargas', parishes: ['El Cobre'] },
            { name: 'Junín', parishes: ['Rubio', 'Bramón', 'La Petrolea', 'Quinimarí'] },
            { name: 'Libertad', parishes: ['Capacho Viejo', 'Cipriano Castro', 'Manuel Felipe Rugeles'] },
            { name: 'Libertador', parishes: ['Abejales', 'Doradas', 'Emeterio Ochoa', 'San Joaquín de Navay'] },
            { name: 'Lobatera', parishes: ['Lobatera', 'Constitución'] },
            { name: 'Michelena', parishes: ['Michelena'] },
            { name: 'Panamericano', parishes: ['Coloncito', 'La Palmita'] },
            { name: 'Pedro María Ureña', parishes: ['Ureña', 'Nueva Arcadia'] },
            { name: 'Rafael Urdaneta', parishes: ['Delicias'] },
            { name: 'Samuel Darío Maldonado', parishes: ['La Tendida', 'Boconó', 'Hernández'] },
            { name: 'San Cristóbal', parishes: ['La Concordia', 'Pedro María Morantes', 'San Juan Bautista', 'San Sebastián', 'Francisco Romero Lobo'] },
            { name: 'San Judas Tadeo', parishes: ['Umuquena'] },
            { name: 'Seboruco', parishes: ['Seboruco'] },
            { name: 'Simón Rodríguez', parishes: ['San Simón'] },
            { name: 'Sucre', parishes: ['Queniquea', 'Eleazar López Contreras', 'San Pablo'] },
            { name: 'Torbes', parishes: ['San Josecito'] },
            { name: 'Uribante', parishes: ['Pregonero', 'Cárdenas', 'Potosí', 'Juan Pablo Peñaloza'] }
        ]
    },
    {
        name: 'Trujillo',
        municipalities: [
            { name: 'Andrés Bello', parishes: ['Santa Isabel', 'Araguaney', 'El Jaguito', 'La Esperanza'] },
            { name: 'Boconó', parishes: ['Boconó', 'Ayacucho', 'Burbusay', 'El Carmen', 'General Ribas', 'Guaramacal', 'Monseñor Jáuregui', 'Mosquey', 'Rafael Rangel', 'San Miguel', 'San José', 'Vega de Guaramacal'] },
            { name: 'Bolívar', parishes: ['Sabana Grande', 'Cheregüé', 'Granados'] },
            { name: 'Candelaria', parishes: ['Chejendé', 'Arnulfo Arias', 'Carrillo', 'Cegarra', 'Manuel Salvador Ulloa', 'San José'] },
            { name: 'Carache', parishes: ['Carache', 'La Concepción', 'Cuicas', 'Panamericana', 'Santa Cruz'] },
            { name: 'Escuque', parishes: ['Escuque', 'La Unión', 'Sabana Libre', 'Santa Rita'] },
            { name: 'José Felipe Márquez Cañizales', parishes: ['El Paradero', 'Antonio José de Sucre', 'El Socorro', 'Los Caprichos'] },
            { name: 'Juan Vicente Campo Elías', parishes: ['Campo Elías', 'Arnulfo Gabaldón'] },
            { name: 'La Ceiba', parishes: ['Santa Apolonia', 'El Progreso', 'La Ceiba', 'Tres de Febrero'] },
            { name: 'Miranda', parishes: ['El Dividive', 'Agua Caliente', 'Agua Santa', 'El Cenizo', 'Valerita'] },
            { name: 'Monte Carmelo', parishes: ['Monte Carmelo', 'Buena Vista', 'Santa María del Horcón'] },
            { name: 'Motatán', parishes: ['Motatán', 'El Baño', 'Jalisco'] },
            { name: 'Pampán', parishes: ['Pampán', 'Flor de Patria', 'La Paz', 'Santa Ana'] },
            { name: 'Pampanito', parishes: ['Pampanito', 'La Concepción', 'Pampanito II'] },
            { name: 'Rafael Rangel', parishes: ['Betijoque', 'José Gregorio Hernández', 'La Pueblita', 'Los Cedros'] },
            { name: 'San Rafael de Carvajal', parishes: ['Carvajal', 'Campo Alegre', 'Concepción Palacios', 'Antonio Nicolás Briceño'] },
            { name: 'Sucre', parishes: ['Sabana de Mendoza', 'Junín', 'La Tendida', 'Valmore Rodríguez'] },
            { name: 'Trujillo', parishes: ['Trujillo', 'Andrés Linares', 'Cristóbal Mendoza', 'Chiquinquirá', 'Monseñor Carrillo', 'Tres Esquinas'] },
            { name: 'Urdaneta', parishes: ['La Quebrada', 'Cabimbú', 'Jajó', 'La Mesa de Esnujaque', 'Tuñame'] },
            { name: 'Valera', parishes: ['Valera', 'La Beatriz', 'La Puerta', 'Mendoza del Valle de Momboy', 'San Luis'] }
        ]
    },
    {
        name: 'Yaracuy',
        municipalities: [
            { name: 'Arístides Bastidas', parishes: ['San Pablo'] },
            { name: 'Bolívar', parishes: ['Aroa'] },
            { name: 'Bruzual', parishes: ['Chivacoa', 'Campo Elías'] },
            { name: 'Cocorote', parishes: ['Cocorote'] },
            { name: 'Independencia', parishes: ['Independencia'] },
            { name: 'José Antonio Páez', parishes: ['Sabana de Parra'] },
            { name: 'La Trinidad', parishes: ['Boraure'] },
            { name: 'Manuel Monge', parishes: ['Yumare'] },
            { name: 'Nirgua', parishes: ['Nirgua', 'Salom', 'Temerla'] },
            { name: 'Peña', parishes: ['Yaritagua', 'San Andrés'] },
            { name: 'San Felipe', parishes: ['San Felipe', 'Albarico', 'San Javier'] },
            { name: 'Sucre', parishes: ['Guama'] },
            { name: 'Urachiche', parishes: ['Urachiche'] },
            { name: 'Veroes', parishes: ['Farriar', 'El Guayabo'] }
        ]
    },
    {
        name: 'Zulia',
        municipalities: [
            { name: 'Almirante Padilla', parishes: ['Isla de Toas', 'Monagas'] },
            { name: 'Baralt', parishes: ['San Timoteo', 'General Urdaneta', 'Libertador', 'Marcelino Briceño', 'Pueblo Nuevo', 'Manuel Guanipa Matos'] },
            { name: 'Cabimas', parishes: ['Ambrosio', 'Carmen Herrera', 'La Rosa', 'Punta Gorda', 'Jorge Hernández', 'Rómulo Betancourt', 'San Benito', 'Germán Ríos Linares', 'Áristides Calvani'] },
            { name: 'Catatumbo', parishes: ['Encontrados', 'Udón Pérez'] },
            { name: 'Colón', parishes: ['San Carlos del Zulia', 'Santa Cruz del Zulia', 'Santa Bárbara', 'El Moralito', 'Urribarrí'] },
            { name: 'Francisco Javier Pulgar', parishes: ['Pueblo Nuevo El Chivo', 'Carlos Quevedo', 'Francisco Javier Pulgar', 'Simón Rodríguez'] },
            { name: 'Jesús Enrique Lossada', parishes: ['La Concepción', 'San José', 'Mariano Parra León', 'José Ramón Yépez'] },
            { name: 'Jesús María Semprún', parishes: ['Casigua El Cubo', 'Barí'] },
            { name: 'La Cañada de Urdaneta', parishes: ['Concepción', 'Andrés Bello', 'Chiquinquirá', 'El Carmelo', 'Potreritos'] },
            { name: 'Lagunillas', parishes: ['Alonso de Ojeda', 'Libertad', 'Campo Lara', 'Eleazar López Contreras', 'Venezuela'] },
            { name: 'Machiques de Perijá', parishes: ['Machiques', 'Libertad', 'San José de Perijá', 'Bartolomé de las Casas'] },
            { name: 'Mara', parishes: ['San Rafael', 'La Sierrita', 'Las Parcelas', 'Luis de Vicente', 'Monagas', 'Ricaurte', 'Tamare'] },
            { name: 'Maracaibo', parishes: ['Bolívar', 'Cacique Mara', 'Caracciolo Parra Pérez', 'Cecilio Acosta', 'Cristo de Aranza', 'Coquivacoa', 'Chiquinquirá', 'Idelfonso Vásquez', 'Juana de Ávila', 'Luis Hurtado Higuera', 'Manuel Dagnino', 'Olegario Villalobos', 'Raúl Leoni', 'Santa Lucía', 'Venancio Pulgar', 'Francisco Eugenio Bustamante', 'San Isidro', 'Antonio Borjas Romero'] },
            { name: 'Miranda', parishes: ['Altagracia', 'Faría', 'Ana María Campos', 'San Antonio', 'San José'] },
            { name: 'Guajira', parishes: ['Sinamaica', 'Alta Guajira', 'Elías Sánchez Rubio', 'Guajira'] },
            { name: 'Rosario de Perijá', parishes: ['Donaldo García', 'El Rosario', 'Sixto Zambrano'] },
            { name: 'San Francisco', parishes: ['San Francisco', 'Francisco Ochoa', 'Los Cortijos', 'Marcial Hernández', 'San Ramón', 'Domitila Flores', 'El Bajo', 'José Domingo Rus'] },
            { name: 'Santa Rita', parishes: ['Santa Rita', 'Pedro Lucas Urribarrí', 'José Cenobio Urribarrí', 'El Mene'] },
            { name: 'Simón Bolívar', parishes: ['Manuel Manrique', 'Rafael María Baralt', 'Rafael Urdaneta'] },
            { name: 'Sucre', parishes: ['Bobures', 'Gibraltar', 'Heras', 'El Batey', 'Monseñor Arturo Álvarez', 'Rómulo Gallegos'] },
            { name: 'Valmore Rodríguez', parishes: ['Bachaquero', 'La Victoria', 'Rafael Urdaneta', 'Raúl Cuenca'] }
        ]
    },
    {
        name: 'Dependencias Federales',
        municipalities: [
            { name: 'Dependencias Federales', parishes: ['Los Roques', 'La Orchila', 'La Tortuga', 'Las Aves', 'Los Testigos', 'Los Frailes', 'Los Monjes', 'Patos', 'La Sola', 'Aves de Sotavento'] }
        ]
    }
];

export const seedData = {
    characteristicsData,
    educationLevelData,
    workConditionData,
    activityConditionData,
    servicesData,
    courtSubjects,
    subjectsData,
    locationData
};
