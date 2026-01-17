import type { UserRepository } from "#domain/repositories.ts";
import { USER_URL } from "./apiUrl";
import type { UserDAO } from "#database/daos/userDAO.ts";
import { daoToUserModel, type UserModel } from "#domain/models/user.ts";

const AUTH_URL = "http://localhost:3000/api/v1/auth";

export function getUserRepository(): UserRepository {
    return {
        findAllUsers: async () => {
            const responseUsers = await fetch(USER_URL);
            if (!responseUsers.ok) return [];
            const usersData = await responseUsers.json();
            const usersDAO: UserDAO[] = usersData.data;
            return usersDAO.map(daoToUserModel);
        },
        findUserById: async (id) => {
            const responseUser = await fetch(`${USER_URL}/${id}`);
            if (!responseUser.ok) return null;
            const userData = await responseUser.json();
            const userDAO: UserDAO = userData.data;
            return daoToUserModel(userDAO);
        },
        authenticate: async (email: string, password: string) => {
            const response = await fetch(AUTH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
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
        },
        updateUser: async (id: string, data: Partial<UserModel>) => {
            const response = await fetch(`${USER_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el usuario');
            }
            const result = await response.json();
            const updatedUserDAO: UserDAO = result.data;
            return daoToUserModel(updatedUserDAO);
        }
    } as UserRepository;
}