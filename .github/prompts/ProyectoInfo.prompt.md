---
mode: agent
---
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
ENUNCIADO DEL PROYECTO 
Automatización del Programa de Clínicas Jurídicas 
En la Escuela de Derecho de la UCAB, se lleva a cabo el programa denominado Clínicas 
Jurídicas, con el cual se atienden y asesoran, en el ámbito legal, personas de las 
comunidades de Ciudad Guayana para resolver distintos casos en materia civil,  familiar, 
penal, laboral, entre otros, como por ejemplo una demanda laboral o el trámite de un divorcio 
ante las autoridades  competente.  Este |proyecto está enmarcado en el  ODS 16 , Justicia y 
Paz, que busca “Promover sociedades pacíficas e inclusivas para el desarrrollo sostenible, 
facilitar el acceso a la justicia para todos y crear instituciones eficaces, responsables e 
inclusivas a todos los niveles”.  
Al llevar este proceso de forma manual y debido a la cantidad de datos que estos procesos 
generan, se hace complejo realizar un seguimiento exhaustivo a los distintos casos que se 
plantean, así como ocurre para generar los informes o estadísticas sobre los casos atendidos 
y resueltos y que deben ser presentados ante las Autoridades de la Universidad, es por ello 
que se requiere de la automatización del referido proceso. 
Sobre el programa Clínica Jurídicas, la Directora de Escuela de Derecho, de la UCAB 
extensión Guayana, nos comenta que:  
• A cada solicitante se le crea un expediente, donde se guardan sus datos de 
identificación, vivienda y servicios conexos y datos de su familia y hogar. Los datos de 
interés se muestran en el Anexo 1 (Registro y Control de Beneficiarios).  
• Cada solicitante puede requerir de varios servicios, lo cual implica la apertura de un 
CASO por cada servicio solicitado. Para cada caso se crea un Historial del Caso, con 
lo que se recoge información necesaria sobre la situación a resolver, requiriéndose 
para ello conocer: el identificador del caso, el tipo del caso (sobre lo cual ya existe un 
catálogo de tipologías, especificadas en Anexo 2 - Ámbito Legal), una síntesis de la 
situación, el tipo de trámite y los soportes consignados (que pueden ser de distintos 
tipos: documentos, videos, audios, imágenes etc). Dada a la importancia que revisten 
las pruebas o soportes en cualquier  un caso legal,  se debe considerar el resguardo 
de cada uno de los soportes consignados y la fecha en que se consignó. 
• También, para cada caso registrado se debe especificar el TERM o semestre 
académico al cual corresponde (ejemplo : 202515, 202525 ), así como el núcleo o 
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
centro donde se originó el caso, pudiendo  ser, hasta ahora, la UCAB-Gy o la Casa 
Barandariam en San Félix, sin descartar la posibilidad del surgimiento de nuevos 
centros con el paso del tiempo. 
• A cada caso, se le asocian  sus beneficiarios (en caso de existir). Sobre los 
beneficiarios de un caso, algunos de ellos pudieran ser menores de edad, y de cada 
beneficiario se requiere: su cédula (opcional), nombres completos, sexo, edad, 
parentesco y tipo de beneficiario (directo o indirecto).  
• Sobre el parentesco o relación de cada beneficiario con el solicitante,  no solo se 
incluyen las relaciones por consanguinidad sino también pueden ser por afinidad e 
incluso relaciones indirectas.  Los datos solicitados para la apertura de un  caso,  se 
muestran en el Anexo 3 (Historial del Caso). 
• A cada caso se le asigna uno o varios estudiantes de la Escuela de Derecho, que 
serán los responsables de llevar el caso, así como también se le asigna, al menos, un 
profesor de la referida Escuela, que servirá de guía a los estudiantes. El o los 
estudiante(s) y profesor (es) que intervienen en un caso pueden cambiar con el paso 
del tiempo. 
• Un caso puede durar mas de un semestre académico, por lo cual los responsables ( 
profesores y estudiantes) pueden cambiar, con el paso del tiempo. 
• Durante todo el desarrollo del caso, desde su inicio hasta su cierre, pueden intervenir 
varios estudiantes y profesores, para cada uno de ellos se requiere conocer los 
períodos de tiempos en los que intervinieron en el caso.  
• Dado que, para resolver cada caso, implica la realización de acciones, el detalle de 
estas acciones debe quedar registrado de forma cronológicas (registrando la fecha en 
que ocurrió la acción) así como también la fecha y el responsable de quien registró la 
acción al sistema. 
• Puesto que un caso generalmente no se resuelve inmediatamente, se  programan 
citas en el que el solicitante debe comparecer a la oficina de Clínicas Jurídicas, por lo 
que deben registrarse las próximas citas para su posterior atención por el estudiante o 
profesor responsable.  
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
• De estas citas surgen orientaciones por parte del estudiante que atiende el caso, por 
lo que deben registrarse, para efecto del control que se le hace a cada caso. 
• Para facilitar el seguimiento a cada caso, se deben manejar  una condición de estatus, 
que permita saber si el caso está Abierto, En trámite, En Pausa o Cerrado. 
• Aunque a cada caso tiene asignado uno o varios responsables directos, y ellos serán 
los principales ejecutores de las acciones realizadas sobre el caso, cualquier otro 
usuario del sistema (estudiante o profesor) puede hacer el registro de alguna acción, 
es por ello que es sumamente importante almacenar el usuario quien hizo el registro 
en el sistema. 
• Por cuanto a los casos se les asocia estudiantes responsables de llevarlos, y estos 
cambian de semestre a semestre, se debe considerar la actualización masiva de los 
datos básicos de los estudiantes de la Escuela de Derecho, para cada período 
académico, sin perder los datos de los estudiantes que ya han intervenido en algún 
caso.   
• El sistema debe generar las facilidades para que se puedan consultar en línea, cuales 
casos lleva un determinado usuario u otras consultas. 
• Cualquier operación al sistema debe quedar registrada., por lo cual debe contemplarse 
un sistema de seguridad en el acceso. 
• El sistema debe brindar las opciones de generación de reportes e informes 
estadísticos, tales como: 
✓ Ficha del solicitante 
✓ Historial de casos para un solicitante, en un rango de fecha. 
✓ Detalle de un caso en particular. 
✓ Consulta de casos por estatus. 
✓ Informe resumen de casos por TERM o semestre académico, tipo de casos en un 
rango de fecha requerida. 
• Todos los reportes o informes deben tener la facilidad de generarse por período 
académico, o rangos de fechas, así como por otros parámetros que permita la 
independencia del usuario del sistema y no depender del programador.  
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
• Además, el sistema debe poder generar los  reportes previstos en el Anexo 4 ( 
Informe de Memoria y Cuenta del Centro de Clínica Jurídica) 
Aclaratoria : En la vida real, la generación de la información acá suministrada, estaría 
precedida por reuniones y entrevistas con los usuarios del sistema actual y del sistema 
propuesto para determinar las necesidades de datos y preferencias de los usuarios. Se 
supondrá que estas reuniones tuvieron lugar y que la información que se le suministra se 
desarrolló a partir de ellas. Cualquier información adicional, se la suministrará el profesor de 
la materia, quien podrá acordar una reunión con el cliente del sistema, la Directora de la 
Escuela de Derecho, de la UCAB-Guayana 
Note que, en este punto, no se hacen suposiciones acerca de la estructura interna de la 
base de datos. Los reportes y formas (formatos)  se diseñan con base en las necesidades del 
usuario , no de las estructuras de los archivos de la bases de datos. 
Nota importante: Se adjunta al presente documento, un archivo en Excel con los formatos 
actualizados de los documentos que se referencian en el enunciado, los cuales deben 
contratarse con los Anexos 1,2 y 3, 
ALCANCE DEL PROYECTO  
El grupo deberá implementar un sistema de base de datos, completamente funcional, a 
través de: 
1. La determinación de los requerimientos de la base de datos y la aplicación, que 
comprende: 
• La lista definitiva de los supuestos semánticos para la creación de la base de datos 
y la aplicación, tomando como punto de partida la información suministrada por el 
profesor en este enunciado, los documentos adjuntos y el archivo Excel de 
muestra, que actualmente se utilizan en el proceso manual.   
2. La elaboración del modelo conceptual de la base de datos, que comprende: 
• El diseño del diagrama E/R  (reflejando entidades, atributos, relaciones, atributos 
claves, cardinalidades, tipo de relación). 
• La lista de los supuestos semánticos de dominio y de validación asociados al 
diagrama E/R construido. 
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
• La especificación de los supuestos semánticos asumidos durante la elaboración 
del Diagrama E/R y que no fueron considerados inicialmente. 
• La identificación de los supuestos semánticos que no se puedan reflejar en el  
diagrama y fueron determinados como requerimientos. 
3. La elaboración del modelo lógico de la base de datos, que comprende: 
• El Modelo Relacional (grafo relacional y conjunto de tablas que conforman la base 
de datos). 
• Normalización de la base de datos. 
• Modelo lógico relacional (Resumen de la estructura lógica de cada una de las 
tablas que conforman la base de datos). 
4. La implementación del modelo físico de la base de datos en el manejador de bases de 
datos SQLServer. 
5. La implementación de una aplicación completamente funcional para la gestión de las 
Clínicas Jurídicas en la Escuela de Derecho de la UCAB-Guayana. Contemplando en 
el diseño de la aplicación, elementos visuales alusivos al ODS 16, Justicia y Paz. 
RESUMIENDO LOS  REQUERMIMIENTOS 
El sistema a desarrollar deberá contemplar los siguientes requerimientos mínimos:  
• Mantenimiento de todos los datos básicos: solicitantes, profesores, estudiantes, casos 
y seguimiento de casos, CRUD (Create, Read, Update Delete, las 4 operaciones 
básicas de una BD).  
• Consultas generales de los datos cargados en el sistema. Estas consultas deben ser 
lo suficientemente flexibles (se deben definir por lo menos dos (2) criterios de consulta 
por estructura), para que a los usuarios del Sistema de Gestión de Clínicas Jurídicas 
se le facilite el suministro de información a los solicitantes y el seguimiento de cada 
uno de los casos reportados etc.  
• Generación del informe de los casos atendidos, pendientes y/o cerrados en un lapso 
de tiempo dado. 
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
• Presentación de estadísticas a través de gráficas y cuadros (dashboard).  
• Cada una de las entidades y/o relaciones establecidas en su modelo debe estar 
representada por una interfaz intuitiva y amigable que permita insertar, consultar, 
modificar o eliminar información guiándose por las restricciones de integridad 
definidas. 
• Debe considerarse, todas las funcionalidades, que automaticen todo el proceso 
descrito, desde el inicio de una solicitud hasta su cierre y posterior generación de 
informes de estadísticas.  
En general el grupo debe crear un sistema de bases de datos donde considere el proceso 
anteriormente descrito y que permita almacenar todas la información solicitada, así mismo 
implementar esta base de datos completa de forma tal que a través del sistema desarrollado 
se pueda ingresar, consultar, modificar o eliminar datos sobre las estructuras definidas. 
SOBRE LA APLICACIÓN CLIENTE 
El sistema a desarrollar debe ser un sistema, amigable e intuitivo,  que facilite la realización 
del proceso de clínicas jurídicas llevado a cabo por la Escuela de Derecho y que  contemple 
todos los requerimientos planteados, siendo alguno de ellos:  
• Registrar y mantener todos los datos básicos de los beneficiarios, estudiantes y  
profesores responsables de los casos, historias de casos, seguimiento, etc. A esto lo 
llamaremos CRUD (Create Read, Update Delete, las 4 operaciones básicas de una 
BD), para ello,   cada una de las entidades y/o relaciones establecidas en su modelo 
de datos debe estar representada por una interfaz que permita insertar, consultar, 
modificar o eliminar información guiándose por las restricciones de integridad definidas 
por el equipo. 
• Realizar consultas generales de los datos cargados en el sistema. Estas consultas 
deben ser lo suficientemente flexibles (se deben definir por lo menos dos (2) criterios 
de consulta por estructura), para que a los usuarios del sistema (estudiantes y 
profesores), se le facilite el suministro de información sobre cada caso registrado y los 
avances realizados. 
• Generar reportes con los datos derivados del proceso y que se mantienen almacenada 
en la base de datos.   
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
• Mantener un orden lógico para el registro de la información en el proceso. Por 
ejemplo, no se puede registrar una caso  sin haberse registrado el beneficiario. 
• Considerar todas las funcionalidades que debe abarcar el sistema a automatizar. 
• Documentar el sistema, a nivel de proceso y uso de la aplicación. 
• En general, el grupo debe crear un sistema de bases de datos que abarque  cada uno 
de los elementos de datos contemplado en el proceso descrito anteriormente y que 
permita almacenar todas las transacciones que se derivan del proceso. 
CONFORMACION DE GRUPOS 
• El proyecto debe ser elaborado por grupos de máximo cuatro(4) estudiantes. Bajo 
ningún concepto se aceptarán grupos que no cumplan con este requisito, deben 
definir un líder del grupo quien se reunirá con el profesor y el cual debe rotarse en las 
distintas fases del proyecto.  
• Los distintos grupos pudieran asistir, previa notificación al profesor,  a alguna de las 
sesiones de atención de beneficiarios llevada a cabo por la Escuela de Derecho, 
realizada los días miércoles, dentro del programa de Clínica Jurídicas. 
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
INFORMACIÓN SOBRE LAS ENTREGAS 
El proyecto se desarrollará en dos (2) partes, cada una constituirá una entrega:   
Primera entrega : Diseño conceptual de la BD y diseño preliminar de la aplicación 
• Fecha de la primera entrega: viernes 07 de noviembre de 2025 – Valor : 6 % 
• Se debe presentar un informe estructurado en tres (3) partes: 
Parte I .-  El diseño conceptual de la base de datos, que abarca: 
1. La determinación de los requerimientos de la base de datos. Consistente en : 
La lista definitiva de los supuestos semánticos para la creación de la base de datos y 
la aplicación, tomando como punto de partida la información suministrada por el 
profesor, en este enunciado, los documentos adjuntos y archivos Excel de muestra,  
que actualmente se utilizan en el proceso manual.   
2. El diagrama E/R,  reflejando: entidades, atributos, relaciones, jerarquías, atributos 
claves, y  cardinalidades (mínima y máxima) y tipo de relación (1:1, 1:N, N:M). 
3. Lista de  los supuestos semánticos asociado a los dominios de los atributos y otras 
validaciones. 
4. Lista de  los supuestos semánticos complementarios o asumidos durante la 
elaboración del modelo conceptual. 
5. Lista  de  la semántica  no reflejada ( especificación de las suposiciones semánticas o 
requerimientos  que fueron identificados y que no fueron reflejados en el  D E/R ). 
Entregable : Incluir en el informe el producto de cada uno de estos puntos. 
Parte II.-  El diseño lógico  de la base de datos: 
A partir del diseño conceptual obtenido, elabore el  modelo lógico de la base de datos que 
incluya : 
1. El Grafo relacional de la BD. 
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
2. El modelo lógico relacional, constituido por las relaciones  (tablas) de la base de datos 
normalizada,  presentadas en un formato similar al utilizado en la Asignación Práctica 
No. 1  y que se muestra a continuación : 
3. Las reglas de integridad semánticas que deben ser aplicadas a su esquema lógico 
(transformación de los supuestos semánticos del diagrama E/R al esquema relacional), 
ver ejemplo en el libro de Dolores Cuadra’- Editorial RAM-MA.  En un cuadro como el  
descrita a continuación: 
Supuestos semánticos de 
validación y dominio en el 
modelo conceptual 
Transformación en el 
esquema relacional 
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
4. Los requerimientos funcionales del sistema, referido a las distintas funciones u 
operaciones que se automatizarán a  través de la aplicación. Por ejemplo : el CRUD 
(Creación- Insertar, Read-Leer, Update-actualizar, Delete-eliminar) de los beneficiarios, 
casos, seguimiento a casos, etc. Estas funcionalidades deben venir acompañadas de la 
regla de negocio a la que aplica (si es que aplica), y debe presentarlo en el siguiente 
cuadro : 
Funcionalidad del sistema 
Regla del Negocio  
Parte III.-  El diseño de la aplicación: 
Presentar la primera  versión o diseño preliminar de la aplicación, que incluye: 
✓ Una carta estructural o modular del sistema. 
✓ Un  diseño preliminar de las interfaces o  pantallas que conforman el sistema. 
✓ Un diseño preliminar de los reportes  a generar. 
✓ Se debe incluir una  breve descripción (propósito) de cada una de los módulos que 
conformarán la aplicación  y las tablas que usaran. Es importante incorporar algunos 
elementos del  ODS 16 en el diseño de las interfaces ( pantallas) de la aplicación. 
Segunda entrega : Implementación de la aplicación (entrega y defensa)  
• Fecha de la segunda  entrega: Semana del 12 al 16 de enero de 2026– valor : 24 %  
La  segunda entrega,  se realizará hasta el domingo 11 de enero de 2026,  que 
comprende : 
I ) Un informe que contenga: 
a) El Diseño Conceptual definitivo (modelo conceptual a través de DER), con las 
correcciones realizadas. 
b) El Diseño Lógico definitivo ( modelo relacional: grafo + esquema lógico) 
c) El Diseño Físico de la BD : se deben incluir los script con la creación de tablas, 
dominios, Constraints, Indices, etc. en SQL (esquema de la BD) 
d) El diseño de la aplicación ( mostrando una carta estructural del sistema, interfaz de 
pantallas y reportes, miniespecificación de la lógica de programación de cada 
módulo: indicando las tablas a utilizar y una breve descripción de como se 
realizarán las operaciones de manipulación (CRUD) sobre la BD).  
UNIVERSIDAD CATÓLICA ANDRÉS BELLO 
INGENIERíA  INFORMÁTICA 
Sistemas de Bases de Datos   
PROYECTO GRUPAL - SEMESTRE 2026-15 
Un proyecto para fomentar la justicia social 
e) Explicación detallada de ajustes realizados a la base de datos con respecto al 
modelo conceptual y lógico entregados y corregidos en la primera entrega. 
Presentar justificar del porque de los cambios. 
f) Principales inconvenientes u obstáculos presentados y como lo resolvieron. 
g) Justificación sobre en cual de los ODS, enmarca el proyecto. Detalle bien las 
razones, especificando sobre cuales metas tiene mayor impacto directo.  
h) El reporte del trabajo realizado por cada miembro del equipo:  
Integrante  
Actividad Realizada (**) Rol Desempeñado (*) 
Rol Desempeñado*: Puede ser Líder de Grupo o Analista/Programador.  El rol de líder 
deber rotarse entre  los integrantes del equipo durante el desarrollo del proyecto, 
existiendo solo un líder en un momento determinado. Esta persona deberá coordinar 
las actividades del grupo y garantizar que se integre cada uno de los desarrollos 
hechos por sus compañeros. (**)Debe especificar las actividades realizadas por cada 
miembro del equipo. 
i) 
Algún valor agregado como equipo en lo que  respecta a la conservación del 
ambiente 
II) La defensa  o presentación del proyecto : demostración de la funcionalidad de la 
aplicación informática construída en JAVA, PHP u otro desarrollador de 
aplicaciones y el manejador de bases de datos SQL Server., se realizará el día 
martes 13 de enero de 2026,  en horario de clases. 
Sobre la defensa del proyecto : 
• El día de la entrega final, el  profesor  escogerá uno o más  de los integrantes de cada 
grupo para la defensa del proyecto, quien serán los responsables de responder a las 
preguntas que haga el profesor sobre la realización del proyecto. 
• Para determinar  la nota  final, se le aplicará el 100% al total de puntos obtenidos, en 
la evaluación del diseño físico de la BD, la aplicación  y el  informe, si la defensa fue 
Excelente,  el 75% si la defensa resultó Buena, 50% si el resultado fue regular y 25% 
si el resultado de la defensa fue Deficiente.  ( este criterio de evaluación se aplicará de 
forma individual). 