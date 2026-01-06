import type { LoginRepository } from "#domain/repositories.ts";
import type { UserDAO } from "#database/daos/userDAO.ts";
import { daoToUserModel } from "#domain/models/user.ts";

const AUTH_URL = "http://localhost:3000/api/v1/auth";

export function getLoginRepository(): LoginRepository {
    return {
        login: async (email: string, password: string) => {
            const loginRequest = {
                email,
                password
            };

            const response = await fetch(AUTH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginRequest)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en autenticación');
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Credenciales inválidas');
            }

            const userDAO: UserDAO = result.data;
            return daoToUserModel(userDAO);
        }
    } as LoginRepository;
}
