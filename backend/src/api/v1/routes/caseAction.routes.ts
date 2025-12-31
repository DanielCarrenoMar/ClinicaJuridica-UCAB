import { Router } from 'express';
import * as caseActionController from '../controllers/caseAction.controller.js';

const router = Router();

router.get('/', caseActionController.getAllCaseActions);
router.post('/', caseActionController.createCaseAction);

export default router;
