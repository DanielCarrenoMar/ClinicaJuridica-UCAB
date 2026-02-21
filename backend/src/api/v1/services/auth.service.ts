import prisma from '#src/config/database.js';
import { PasswordUtil } from '../utils/password.util.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#src/config.js';
import { LoginReqDTO } from '@app/shared/dtos/LoginDTO';
import { PacketDTO } from '@app/shared/dtos/packets/PacketDTO';

class authService {
  async loginUser({ email, password }: LoginReqDTO): Promise<PacketDTO<{ token: string }>> {
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

      return {
        success: true,
        message: 'Login exitoso',
        data: { token: jwt.sign({ identityCard: fondUser.identityCard, role: fondUser.type }, JWT_SECRET, { expiresIn: '7d' }) }
      };

    } catch (error: any) {
      console.error('Error en el proceso de autenticación:', error);
      return {
        success: false,
        error: 'Error en el proceso de autenticación',
        message: 'Error en el proceso de autenticación'
      };
    }
  }

  async changeUserPassword(id: string, newPassword: string): Promise<PacketDTO<null>> {
    try {
      const hashedPass = await PasswordUtil.hash(newPassword);
      await prisma.user.update({
        where: { identityCard: id },
        data: { password: hashedPass }
      });
      return { success: true, message: 'Contraseña actualizada correctamente' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

}

export default new authService();
