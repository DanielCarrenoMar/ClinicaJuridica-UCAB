import { Request, Response } from 'express';
import userService from '../services/user.service.js';

class UserController {
  // Obtener todos los usuarios
  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await userService.getAllUsers();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios',
        error: error.message
      });
    }
  }

  // Obtener un usuario por ID (Cédula)
  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID (Cédula) inválido' });
      }

      const result = await userService.getUserById(id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Crear un nuevo usuario
  async createUser(req: Request, res: Response) {
    try {
      const { idUser, firstName, lastName, email, gender } = req.body;

      // Validación básica: que no falten datos obligatorios
      if (!idUser || !firstName || !lastName || !email || !gender) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos obligatorios (Cédula, nombre, apellido, email o género)'
        });
      }

      const result = await userService.createUser(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Actualizar usuario
  async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await userService.updateUser(id, req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Eliminar usuario
  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await userService.deleteUser(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Endpoint especial para meter los 3 usuarios de prueba (Seed)
  async seedUsers(req: Request, res: Response) {
    try {
      const result = await userService.seedInitialUsers();
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new UserController();