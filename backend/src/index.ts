import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

// --- 1. Dominio: Gestión de Casos (Core) ---

// RegisterNewCaseUseCase (Registrar Nuevo Caso)
app.post('/api/cases', async (req, res) => {
  // Input: Datos del beneficiario, síntesis del problema.
  // TODO: Implement RegisterNewCaseUseCase
  // 1. Verifica si el beneficiario ya existe (o lo crea).
  // 2. Genera el ID secuencial personalizado (GY-24_25-001).
  // 3. Establece el estado inicial ("Recepción").
  // 4. Crea la primera entrada en la Bitácora ("Caso abierto").
  res.status(501).json({ message: 'TODO: Implement RegisterNewCaseUseCase' });
});

// AssignCaseTeamUseCase (Asignar Equipo al Caso)
app.post('/api/cases/:id/team', async (req, res) => {
  // Input: caseId, professorId, lista de studentIds.
  // TODO: Implement AssignCaseTeamUseCase
  // 1. Valida que el profesor sea activo.
  // 2. Valida que los estudiantes pertenezcan al periodo académico actual.
  // 3. Registra la asignación en la BD.
  // 4. Genera una notificación.
  res.status(501).json({ message: 'TODO: Implement AssignCaseTeamUseCase' });
});

// UpdateCaseStatusUseCase (Actualizar Estado del Caso)
app.patch('/api/cases/:id/status', async (req, res) => {
  // Input: caseId, newStatus, reason.
  // TODO: Implement UpdateCaseStatusUseCase
  // 1. Valida si la transición de estado es legal.
  // 2. Si el estado es "Cerrado", verifica que no haya acciones pendientes.
  // 3. Guarda el timestamp del cambio.
  // 4. Si el caso vuelve atrás, añade un nuevo registro de movimiento.
  res.status(501).json({ message: 'TODO: Implement UpdateCaseStatusUseCase' });
});

// GetCaseTimelineUseCase (Obtener Línea de Tiempo)
app.get('/api/cases/:id/timeline', async (req, res) => {
  // Input: caseId.
  // TODO: Implement GetCaseTimelineUseCase
  // 1. Recupera acciones internas (bitácora).
  // 2. Recupera actuaciones del tribunal.
  // 3. Mezcla ambas listas y las ordena cronológicamente.
  res.status(501).json({ message: 'TODO: Implement GetCaseTimelineUseCase' });
});

// --- 2. Dominio: Beneficiarios (CRM) ---

// FindBeneficiaryByFuzzySearchUseCase (Búsqueda Difusa)
app.get('/api/beneficiaries/search', async (req, res) => {
  // Input: query (string).
  // TODO: Implement FindBeneficiaryByFuzzySearchUseCase
  // 1. Limpia el input.
  // 2. Ejecuta búsqueda por coincidencia parcial en: Cédula, Nombre, Apellido y Teléfono.
  // 3. Retorna lista de candidatos con sus casos asociados.
  res.status(501).json({ message: 'TODO: Implement FindBeneficiaryByFuzzySearchUseCase' });
});

// LinkRelatedBeneficiaryUseCase (Vincular Relacionado)
app.post('/api/beneficiaries/:id/relationships', async (req, res) => {
  // Input: mainBeneficiaryId, relatedBeneficiaryId, relationshipType.
  // TODO: Implement LinkRelatedBeneficiaryUseCase
  // 1. Crea una relación bidireccional o dirigida según el tipo.
  res.status(501).json({ message: 'TODO: Implement LinkRelatedBeneficiaryUseCase' });
});

// --- 3. Dominio: Tribunales (Legal) ---

// LogTribunalActionUseCase (Registrar Actuación Procesal)
app.post('/api/cases/:id/tribunal-actions', async (req, res) => {
  // Input: caseId, fechaPublicacion, tipoActuacion, descripcion, archivoAdjunto.
  // TODO: Implement LogTribunalActionUseCase
  // 1. Valida que el caso tenga un Número de Expediente de Tribunal asignado.
  // 2. Permite registrar fechas pasadas.
  // 3. Almacena la referencia al archivo si existe.
  res.status(501).json({ message: 'TODO: Implement LogTribunalActionUseCase' });
});

// UpdateTribunalExpedienteUseCase
app.patch('/api/cases/:id/tribunal-info', async (req, res) => {
  // Input: caseId, nroExpediente, tribunalAsignado.
  // TODO: Implement UpdateTribunalExpedienteUseCase
  // 1. Vincula los datos oficiales del tribunal al caso interno.
  res.status(501).json({ message: 'TODO: Implement UpdateTribunalExpedienteUseCase' });
});

// --- 4. Dominio: Académico y Usuarios ---

// RegisterStudentAttendanceUseCase (Registrar Asistencia)
app.post('/api/attendance', async (req, res) => {
  // Input: studentId, location (Sede).
  // TODO: Implement RegisterStudentAttendanceUseCase
  // 1. Registra la fecha y hora de entrada.
  // 2. (Opcional) Valida si está dentro de su horario planificado.
  res.status(501).json({ message: 'TODO: Implement RegisterStudentAttendanceUseCase' });
});

// GenerateAcademicReportUseCase (Reporte Memoria y Cuenta)
app.get('/api/reports/academic', async (req, res) => {
  // Input: periodoAcademico.
  // TODO: Implement GenerateAcademicReportUseCase
  // 1. Agrega datos: Total de casos por materia, por parroquia, y género.
  // 2. Calcula estadísticas de casos cerrados vs. abiertos.
  // 3. Genera la estructura de datos necesaria para graficar o exportar a PDF.
  res.status(501).json({ message: 'TODO: Implement GenerateAcademicReportUseCase' });
});

app.get('/', (req, res) => {
  res.send('Clinica Juridica API is running');
});

// Middleware para manejo de 404 (Ruta no encontrada)
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Middleware para manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});