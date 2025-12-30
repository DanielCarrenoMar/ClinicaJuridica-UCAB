import { Router } from 'express';
import * as applicantController from '../controllers/applicant.controller.js';

const router = Router();

// CRUD Principal
router.get('/', applicantController.getAllApplicant);
router.get('/:id', applicantController.getApplicantById);
router.post('/', applicantController.createApplicant); 
router.put('/:id', applicantController.updateGeneralInfo);
router.delete('/:id', applicantController.deleteApplicantbyId);

// Estudio Socioeconómico
router.get('/:id/socio-economic', applicantController.getFullProfile);
router.put('/:id/housing', applicantController.updateHousing);
router.put('/:id/family', applicantController.updateFamily);

// Relación con Casos
router.get('/:id/cases', applicantController.getApplicantCases);

export default router;