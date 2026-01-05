import { Router } from 'express';
import * as supportDocumentController from '../controllers/supportDocument.controller.js';

const router = Router();

router.get('/', supportDocumentController.getAllSupportDocuments);
router.get('/:id', supportDocumentController.getSupportDocumentById);
router.post('/', supportDocumentController.createSupportDocument);
router.put('/:id', supportDocumentController.updateSupportDocument);

export default router;
