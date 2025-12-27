import express from 'express';
import * as caseController from '../controllers/case.controller.js';

const router = express.Router();

router.get('/', caseController.getAllCases);
router.get('/:id', caseController.getCaseById);
router.post('/', caseController.createCase);

export default router;