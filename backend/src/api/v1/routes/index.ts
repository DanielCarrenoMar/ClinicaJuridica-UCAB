import { Router } from 'express';
import userRoutes from './user.routes.js';
import applicantRoutes from './applicant.routes.js';
import caseRoutes from './case.routes.js';
import beneficiaryRoutes from './beneficiary.routes.js';
import caseActionRoutes from './caseAction.routes.js';
import studentRoutes from './student.routes.js';
import teacherRoutes from './teacher.routes.js';
import healthRoutes from './health.routes.js'; // Asegúrate de crear este archivo

const router = Router();

router.use('/users', userRoutes);
router.use('/applicants', applicantRoutes);
router.use('/cases', caseRoutes);
router.use('/beneficiary', beneficiaryRoutes);
router.use('/case-actions', caseActionRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/salud', healthRoutes);

// Ruta raíz de la API v1
router.get('/', (req, res) => {
  res.json({
    mensaje: 'API v1.0 de Clínica Jurídica UCAB',
    version: '1.0.0',
    estado: 'activa',
    rutasDisponibles: {
      usuarios: '/api/v1/users',
      solicitantes: '/api/v1/applicants',
      casos: '/api/v1/cases',
      beneficiarios: '/api/v1/beneficiary',
      salud: '/api/v1/salud'
    },
    documentacion: 'Disponible en cada endpoint',
    contacto: 'Equipo de desarrollo - UCAB'
  });
});

export default router;