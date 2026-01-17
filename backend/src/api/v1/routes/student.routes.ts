import { Router } from 'express';
import multer from 'multer';
import * as studentController from '../controllers/student.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', studentController.getAllStudents);
router.post('/import', upload.single('file'), studentController.importStudents);
router.get('/:id/cases', studentController.getCasesByStudentId);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);

export default router;
