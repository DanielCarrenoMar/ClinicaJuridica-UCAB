// @ts-nocheck
import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// Obtener usuarios
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/cases', userController.getUserCases); 

// Crear usuarios
router.post('/', userController.createUser);

// Modificar usuarios
router.put('/:id', userController.updateUser);
router.patch('/:id/status', userController.changeUserStatus);
router.patch('/:id/password', userController.changePassword);

// Borrar usuarios
router.delete('/:id', userController.deleteUser);

export default router;