import type { Request, Response } from 'express';
import loginService from '../services/login.service.js';
import { LoginReqDTO } from '@app/shared/dtos/LoginDTO';
import { validateRequiredParams } from '../utils/checkParameters.util.js';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const errorMsg = validateRequiredParams<LoginReqDTO>(req.body, ['email', 'password']);
    if (errorMsg) {
      res.status(400).json({ 
        success: false, 
        message: errorMsg 
      });
      return;
    }

    const result = await loginService.authenticateUser(req.body as LoginReqDTO);
    
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
