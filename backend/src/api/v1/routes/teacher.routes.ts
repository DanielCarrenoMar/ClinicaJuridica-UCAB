import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller.js';

const router = Router();

router.get('/', teacherController.getAllTeachers);
router.post('/', teacherController.createTeacher);
router.get('/:id/cases', teacherController.getCasesByTeacherId);
router.get('/:id', teacherController.getTeacherById);
router.put('/:id', teacherController.updateTeacher);

export default router;
