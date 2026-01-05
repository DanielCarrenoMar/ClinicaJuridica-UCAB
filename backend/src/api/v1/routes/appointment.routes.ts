import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller.js';

const router = Router();

router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);

export default router;
