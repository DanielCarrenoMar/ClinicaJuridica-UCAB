import express from 'express';
import * as caseController from '../controllers/case.controller.js';

const router = express.Router();

// GET /api/v1/cases - Obtener todos los casos
router.get('/', caseController.getAllCases);

// GET /api/v1/cases/:id - Obtener un caso por ID
router.get('/:id', caseController.getCaseById);

// POST /api/v1/cases - Crear un nuevo caso
router.post('/', caseController.createCase);

export default router;