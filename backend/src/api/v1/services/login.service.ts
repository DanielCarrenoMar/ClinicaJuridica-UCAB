import prisma from '#src/config/database.js';
import { LoginReqDTO, LoginResDTO } from '@app/shared/dtos/LoginDTO';
import { PasswordUtil } from '../utils/password.util.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#src/config.js';

class LoginService {
  async authenticateUser({ email, password }: LoginReqDTO) {
    try {
      const fondUser = await prisma.user.findFirst({
        where: {
          email: email,
          isActive: true,
        },
        select: {
          identityCard: true,
          fullName: true,
          gender: true,
          email: true,
          password: true,
          isActive: true,
          type: true,
        },
      });

      if (!fondUser) {
        return {
          success: false,
          message: 'Credenciales inválidas o usuario inactivo'
        };
      }

      const isMatch = await PasswordUtil.compare(password, fondUser.password);

      if (!isMatch) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      const response:LoginResDTO = {
        fullName: fondUser.fullName,
        token: jwt.sign({ email: fondUser.email }, JWT_SECRET, { expiresIn: '1h' })
      };

      return {
        success: true,
        message: 'Login exitoso',
        data: response
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: 'Error en el proceso de autenticación'
      };
    }
  }
}

export default new LoginService();
