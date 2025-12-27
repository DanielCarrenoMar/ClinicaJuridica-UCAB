import express from 'express';
import * as applicantController from '../controllers/applicant.controller.js';

const router = express.Router();

router.get('/', applicantController.getAllApplicants);
router.get('/search', applicantController.searchApplicants);
router.get('/:id', applicantController.getApplicantById);
router.get('/:id/cases', applicantController.getApplicantCases);
router.post('/', applicantController.createApplicant);
router.put('/:id', applicantController.updateApplicant);
router.delete('/:id', applicantController.deleteApplicant);

export default router;