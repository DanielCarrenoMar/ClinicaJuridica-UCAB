import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as supportDocumentController from '../controllers/supportDocument.controller.js';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', supportDocumentController.getAllSupportDocuments);
router.post('/', upload.single('file'), supportDocumentController.createSupportDocument);
router.put('/:id', upload.single('file'), supportDocumentController.updateSupportDocument);
router.get('/:id', supportDocumentController.getSupportDocumentById);
router.delete('/:id/:supportNumber', supportDocumentController.deleteSupportDocument);

export default router;
