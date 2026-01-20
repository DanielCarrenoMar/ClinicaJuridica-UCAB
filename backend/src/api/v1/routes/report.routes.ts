import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';

const router = Router();

// Estadísticas de Casos
router.get('/cases/by-subject', reportController.getCasesBySubject);
router.get('/cases/by-subject-scope', reportController.getCasesBySubjectScope);
router.get('/cases/by-type', reportController.getCasesByType);
router.get('/cases/by-service-type', reportController.getCasesByServiceType);

// Estadísticas de Beneficiarios y Solicitantes
router.get('/gender-distribution', reportController.getGenderDistribution);
router.get('/state-distribution', reportController.getStateDistribution);
router.get('/parish-distribution', reportController.getParishDistribution);
router.get('/beneficiaries/by-parish', reportController.getBeneficiariesByParish);
router.get('/beneficiaries/type-distribution', reportController.getBeneficiaryTypeDistribution);

// Estadísticas de Personal
router.get('/students/involvement', reportController.getStudentInvolvement);
router.get('/professors/involvement', reportController.getProfessorInvolvement);

export default router;
