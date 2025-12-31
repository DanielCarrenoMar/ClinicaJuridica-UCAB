import { Router } from 'express';
import * as caseController from '../controllers/case.controller.js';

const router = Router();

// Operaciones Principales
router.get('/', caseController.getAllCases); 
router.post('/', caseController.createCase);
router.get('/status/amount', caseController.getStatusCaseAmount);
router.get('/:id', caseController.getCaseById);
router.put('/:id', caseController.updateCase);
router.delete('/:id', caseController.deleteCase);

// LOS 3 ENDPOINTS QUE NECESITAS
router.get('/:id/status', caseController.getCaseStatusFromCaseId);        // getStatusFromCaseId -> CaseStatusInfoDAO
router.post('/:id/status', caseController.createStatusForCaseId);        // createStatusForCaseId <= CaseStatusDAO
router.get('/:id/students', caseController.getStudentsFromCaseId);       // getStudentsFromCaseId -> StudentDAO

// Historial
router.post('/:id/actions', caseController.addAction);
router.get('/:id/actions/', caseController.getActionsInfoFromCaseId);
router.get('/:id/beneficiaries', caseController.getBeneficiariesFromCaseId);
router.get('/:id/status', caseController.getCaseStatusFromCaseId);
router.patch('/:id/status', caseController.changeCaseStatus);
//router.get('/:id/timeline', caseController.getTimeline);

// Gestión de Citas
router.post('/:id/appointments', caseController.scheduleAppointment);
router.patch('/:id/appointments/:appId', caseController.updateAppointmentStatus);

// Soportes
router.get('/:id/documents', caseController.getDocuments);    
router.post('/:id/documents', caseController.addDocument);     
router.delete('/:id/documents/:docId', caseController.deleteDocument);

// Asignación Académica y Profesores
// router.post('/:id/assign-student', caseController.assignStudent);
// router.get('/:id/student-history', caseController.getStudentHistory);

export default router;