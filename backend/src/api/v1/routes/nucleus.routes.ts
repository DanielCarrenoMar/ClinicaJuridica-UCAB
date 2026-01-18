import { Router } from 'express';
import * as nucleusController from '../controllers/nucleus.controller.js';

const router = Router();

router.get('/', nucleusController.getAllNuclei);
router.post('/', nucleusController.createNucleus);
router.delete('/:id', nucleusController.deleteNucleus);

export default router;
