import type { Request, Response } from 'express';
import loginService from '../services/login.service.js';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    
    // Validar que se envíen los campos requeridos
    if (!email || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
      return;
    }

    const result = await loginService.authenticateUser(email, password);
    
    if (!result.success) {
      res.status(401).json(result);
      return;
    }
    
    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
