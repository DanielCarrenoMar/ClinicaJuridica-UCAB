// @ts-nocheck
import { Router } from 'express';
import * as semesterController from '../controllers/semester.controller.js';

const router = Router();

router.get('/', semesterController.getAllSemesters);
router.get('/current', semesterController.getCurrentSemester);
router.get('/:term', semesterController.getSemesterById);
router.post('/', semesterController.createSemester);
router.put('/:term', semesterController.updateSemester);
router.delete('/:term', semesterController.deleteSemester);

export default router;
