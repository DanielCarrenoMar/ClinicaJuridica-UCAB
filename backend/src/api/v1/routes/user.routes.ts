import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// Consultas
router.get('/', userController.getAllUsers);
//router.get('/type/:type', userController.getUsersByType);
router.get('/:id', userController.getUserById);

// Buscar Casos Asociados a un Estudiante o Profesor
//router.get('/:id/cases', userController.getUserCases); 

// Acciones de Cuenta
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
//router.patch('/:id/status', userController.changeUserStatus); que se le pase el parametro de true o false
//router.patch('/:id/password', userController.changePassword);

// Eliminación
router.delete('/:id', userController.deleteUser);

export default router;