import { Router } from 'express';
import * as applicantController from '../controllers/applicant.controller.js';

const router = Router();

router.get('/', applicantController.getAllApplicant);
router.get('/:id', applicantController.getApplicantById);
router.post('/', applicantController.createApplicant);
router.put('/:id', applicantController.updateApplicant);
router.delete('/:id', applicantController.deleteApplicantById);

export default router;