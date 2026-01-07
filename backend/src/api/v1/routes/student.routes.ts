import { Router } from 'express';
import * as studentController from '../controllers/student.controller.js';

const router = Router();

router.get('/', studentController.getAllStudents);
router.get('/:id/cases', studentController.getCasesByStudentId);
router.get('/:id', studentController.getStudentById);

export default router;
