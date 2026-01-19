import { Router } from 'express';
import * as statsController from '../controllers/stats.controller.js';

const router = Router();

// Estadísticas de Casos
router.get('/cases/by-subject', statsController.getCasesBySubject);
router.get('/cases/by-subject-scope', statsController.getCasesBySubjectScope);
router.get('/cases/by-type', statsController.getCasesByType);
router.get('/cases/by-service-type', statsController.getCasesByServiceType);

// Estadísticas de Beneficiarios y Solicitantes
router.get('/gender-distribution', statsController.getGenderDistribution);
router.get('/state-distribution', statsController.getStateDistribution);
router.get('/parish-distribution', statsController.getParishDistribution);
router.get('/beneficiaries/by-parish', statsController.getBeneficiariesByParish);
router.get('/beneficiaries/type-distribution', statsController.getBeneficiaryTypeDistribution);

// Estadísticas de Personal
router.get('/students/involvement', statsController.getStudentInvolvement);
router.get('/professors/involvement', statsController.getProfessorInvolvement);

export default router;