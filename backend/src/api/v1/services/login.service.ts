// @ts-nocheck
import prisma from '#src/config/database.js';

class LoginService {
  async authenticateUser(email: string, password: string) {
    try {
      // Consulta SQL para validar credenciales
      const user = await prisma.$queryRaw`
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
          AND u.password = ${password}
          AND u."isActive" = true
      `;

      // Verificar si se encontró un usuario
      if (!user || user.length === 0) {
        return {
          success: false,
          message: 'Credenciales inválidas o usuario inactivo'
        };
      }

      // Retornar el usuario encontrado (primer resultado)
      return {
        success: true,
        message: 'Login exitoso',
        data: user[0]
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
