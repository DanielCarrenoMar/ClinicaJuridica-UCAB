import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as supportDocumentController from '../controllers/supportDocument.controller.js';

const router = Router();

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error('Tipo de archivo no permitido. Solo se aceptan PDF, imágenes (JPG, PNG, WEBP) y documentos Word.'));
      return;
    }
    cb(null, true);
  }
});

router.get('/', supportDocumentController.getAllSupportDocuments);
router.post('/', upload.single('file'), supportDocumentController.createSupportDocument);
router.put('/:id', upload.single('file'), supportDocumentController.updateSupportDocument);
router.get('/:id/:supportNumber', supportDocumentController.getSupportDocumentById);
router.delete('/:id/:supportNumber', supportDocumentController.deleteSupportDocument);

export default router;
