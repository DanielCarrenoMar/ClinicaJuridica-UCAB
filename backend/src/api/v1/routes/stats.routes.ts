import { Router } from 'express';
import * as statsController from '../controllers/stats.controller.js';

const router = Router();

// Estadísticas de Casos
router.get('/cases/by-type', statsController.getQuantityByType);
router.get('/cases/by-status', statsController.getQuantityByStatus);
router.get('/cases/by-parish', statsController.getQuantityByParish);
router.get('/cases/by-period', statsController.getQuantityByPeriod);
router.get('/cases/by-subject', statsController.getQuantityBySubject);
router.get('/cases/by-subject-scope', statsController.getQuantityBySubjectScope);

// Estadísticas de Solicitantes
router.get('/applicants/by-gender', statsController.getApplicantsByGender);
router.get('/applicants/by-state', statsController.getApplicantsByState);
router.get('/applicants/by-parish', statsController.getApplicantsByParish);

// Estadísticas de Beneficiarios
router.get('/beneficiaries/count', statsController.getBeneficiaryTypeCount);
router.get('/beneficiaries/by-parish', statsController.getBeneficiariesByParish);

// Estadísticas de Estudiantes
router.get('/students/by-type', statsController.getStudentsByType);

// Estadísticas de Profesores
router.get('/teachers/by-type', statsController.getTeachersByType);

export default router;