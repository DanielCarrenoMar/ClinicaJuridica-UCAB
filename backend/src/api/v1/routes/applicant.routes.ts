import { Router } from 'express';
import * as applicantController from '../controllers/applicant.controller.js';

const router = Router();

// CRUD Principal
router.get('/', applicantController.getAllApplicant);
router.get('/:id', applicantController.getApplicantById); //ApplicantInfoDAO
router.post('/', applicantController.createApplicant); //ApplicantDAO
router.put('/:id', applicantController.updateApplicant); //ApplicantDAO
router.delete('/:id', applicantController.deleteApplicantById);

export default router;