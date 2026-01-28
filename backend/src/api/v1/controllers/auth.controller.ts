import type { Request, Response } from 'express';
import loginService from '../services/auth.service.js';
import { LoginReqDTO } from '@app/shared/dtos/LoginDTO';
import { validateRequiredParams } from '../utils/checkParameters.util.js';
import userService from '#services/user.service.js';

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

    const { token, ...result } = await loginService.loginUser(req.body as LoginReqDTO);

    if (!result.success) {
      res.status(401).json(result);
      return;
    }

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hora
      })
      .status(200)
      .json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  res
    .clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .status(200)
    .json({ success: true, message: 'Logout exitoso' });
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'No autenticado' });
    return;
  }

  try {
    const result = await userService.getUserById(req.user.identityCard);
    if (!result.success) {
      res.status(404).json(result);
      return;
    }
    res.status(200).json(result);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
