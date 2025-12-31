import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller.js';

const router = Router();

router.get('/:id', teacherController.getTeacherById);

export default router;
