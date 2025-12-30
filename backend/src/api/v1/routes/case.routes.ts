import { Router } from 'express';
import * as caseController from '../controllers/case.controller.js';

const router = Router();

// Operaciones Principales
router.get('/', caseController.getAllCases); 
router.post('/', caseController.createCase);
router.get('/:id', caseController.getCaseById);
router.put('/:id', caseController.updateCase);
router.delete('/:id', caseController.deleteCase);

// Historial
router.post('/:id/actions', caseController.addAction);
router.get('/:id/actions/', caseController.getActionsFromCaseId);
router.patch('/:id/status', caseController.changeStatus);
router.get('/:id/timeline', caseController.getTimeline);

// Gestión de Citas
router.post('/:id/appointments', caseController.scheduleAppointment);
router.patch('/:id/appointments/:appId', caseController.updateAppointmentStatus);

// Soportes
router.get('/:id/documents', caseController.getDocuments);    
router.post('/:id/documents', caseController.addDocument);     
router.delete('/:id/documents/:docId', caseController.deleteDocument);

// Asignación Académica y Profesores
router.post('/:id/assign-student', caseController.assignStudent);
router.get('/:id/student-history', caseController.getStudentHistory);


export default router;