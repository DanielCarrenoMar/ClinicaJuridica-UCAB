import { Router } from 'express';
import * as applicantController from '../controllers/applicant.controller.js';

const router = Router();

// CRUD Principal
router.get('/', applicantController.getAll);
router.post('/', applicantController.create); 
router.put('/:id', applicantController.updateGeneralInfo);
router.delete('/:id', applicantController.deleteApplicant);

// Estudio Socioeconómico
router.get('/:id/socio-economic', applicantController.getFullProfile);
router.put('/:id/housing', applicantController.updateHousing);
router.put('/:id/family', applicantController.updateFamily);

// Relación con Casos
router.get('/:id/cases', applicantController.getApplicantCases);

export default router;