import { Router } from 'express';
import * as caseController from '../controllers/case.controller.js';
import { verifyCaseAccess } from '../middlewares/caseAccess.middleware.js';

const router = Router();

router.param('id', verifyCaseAccess);

router.get('/', caseController.getAllCases);
router.post('/', caseController.createCase);

router.get('/status/amount', caseController.getStatusCaseAmount);
router.get('/:id', caseController.getCaseById);
router.put('/:id', caseController.updateCase);
router.delete('/:id', caseController.deleteCase);

router.get('/:id/status', caseController.getCaseStatusFromCaseId);
router.post('/:id/status', caseController.createStatusForCaseId);
router.get('/:id/students', caseController.getStudentsFromCaseId);

router.get('/:id/appointments', caseController.getAppoitmentByCaseId);
router.post('/:id/appointments', caseController.createAppoitmentForCaseId);

router.get('/:id/support-documents', caseController.getSupportDocumentsById);
router.post('/:id/support-documents', caseController.createSupportDocumentForCaseId);

router.post('/:id/actions', caseController.addAction);
router.get('/:id/actions/', caseController.getActionsInfoFromCaseId);
router.get('/:id/beneficiaries', caseController.getBeneficiariesFromCaseId);
router.patch('/:id/status', caseController.changeCaseStatus);

router.post('/:id/students', caseController.addStudentToCase);
router.delete('/:id/students/:studentId', caseController.removeStudentFromCase);
router.post('/:id/beneficiaries', caseController.addBeneficiaryToCase);
router.delete('/:id/beneficiaries/:beneficiaryId', caseController.removeBeneficiaryFromCase);

export default router;