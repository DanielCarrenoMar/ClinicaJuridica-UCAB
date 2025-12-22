import express from 'express';
import * as applicantController from '../controllers/applicant.controller.js';

const router = express.Router();

// GET /api/v1/applicants - Obtener todos los solicitantes
router.get('/', applicantController.getAllApplicants);

// GET /api/v1/applicants/search - Buscar solicitantes
router.get('/search', applicantController.searchApplicants);

// GET /api/v1/applicants/:id - Obtener un solicitante por ID
router.get('/:id', applicantController.getApplicantById);

// GET /api/v1/applicants/:id/cases - Obtener casos de un solicitante
router.get('/:id/cases', applicantController.getApplicantCases);

// POST /api/v1/applicants - Crear un nuevo solicitante
router.post('/', applicantController.createApplicant);

// PUT /api/v1/applicants/:id - Actualizar un solicitante
router.put('/:id', applicantController.updateApplicant);

// DELETE /api/v1/applicants/:id - Eliminar un solicitante
router.delete('/:id', applicantController.deleteApplicant);

export default router;