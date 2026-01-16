// @ts-nocheck
import prisma from '#src/config/database.js';
import { PasswordUtil } from '../utils/password.util.js';

class LoginService {
  async authenticateUser(email: string, password: string) {
    try {
      // Fetch user by email
      const users = await prisma.$queryRaw`
        SELECT 
          u."identityCard",
          u."fullName",
          u.gender,
          u.email,
          u.password,
          u."isActive",
          u.type
        FROM "User" u
        WHERE u.email = ${email} 
          AND u."isActive" = true
      `;

      // Check if user exists
      if (!users || users.length === 0) {
        return {
          success: false,
          message: 'Credenciales inválidas o usuario inactivo'
        };
      }

      const user = users[0];

      // Compare password with hashed version
      const isMatch = await PasswordUtil.compare(password, user.password);

      if (!isMatch) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      // Remove password from response
      delete user.password;

      return {
        success: true,
        message: 'Login exitoso',
        data: user
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
