import { Router } from 'express';
import multer from 'multer';
import * as studentController from '../controllers/student.controller.js';

const router = Router();

const EXCEL_MIME_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!EXCEL_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error('Solo se permiten archivos Excel (.xls, .xlsx)'));
      return;
    }
    cb(null, true);
  }
});

router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.post('/import', upload.single('file'), studentController.importStudents);
router.get('/:id/cases', studentController.getCasesByStudentId);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);

export default router;
