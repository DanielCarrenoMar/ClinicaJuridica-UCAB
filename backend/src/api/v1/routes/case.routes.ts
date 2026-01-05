import { Router } from 'express';
import * as caseController from '../controllers/case.controller.js';

const router = Router();

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

router.get('/:id/documents', caseController.getDocuments);
router.post('/:id/documents', caseController.createDocumentByCaseId);
router.delete('/:id/documents/:docId', caseController.deleteDocument);
router.get('/:id/documents/:docId', caseController.getDocumentByCaseId);

router.post('/:id/students', caseController.addStudentToCase);
router.delete('/:id/students', caseController.removeStudentFromCase);
router.post('/:id/beneficiaries', caseController.addBeneficiaryToCase);
router.delete('/:id/beneficiaries', caseController.removeBeneficiaryFromCase);

export default router;