import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// GET /api/v1/users - Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// GET /api/v1/users/:id - Obtener un usuario por ID (Cédula)
router.get('/:id', userController.getUserById);

// POST /api/v1/users - Crear un nuevo usuario
router.post('/', userController.createUser);

// PUT /api/v1/users/:id - Actualizar un usuario
router.put('/:id', userController.updateUser);

// DELETE /api/v1/users/:id - Eliminar un usuario
router.delete('/:id', userController.deleteUser);

// POST /api/v1/users/seed - Poblar la base de datos con usuarios de prueba
router.post('/seed', userController.seedUsers);

export default router;