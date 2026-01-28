import type { UserRepository } from "#domain/repositories.ts";
import { USER_URL } from "./apiUrl";
import type { UserDAO } from "#database/daos/userDAO.ts";
import { daoToUserModel } from "#domain/models/user.ts";
import type { LoginResDTO } from "@app/shared/dtos/LoginDTO";

const AUTH_URL = "http://localhost:3000/api/v1/auth";

export function getUserRepository(): UserRepository {
    return {
        findAllUsers: async (params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString() ? `${USER_URL}?${query.toString()}` : USER_URL;
            const responseUsers = await fetch(url);
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
        authenticate: async (email, password) => {
            const response = await fetch(`${AUTH_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en autenticación');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Credenciales inválidas');
            }

            const loginDTO: LoginResDTO = result.data;
            return daoToUserModel(loginDTO);
        },
        updateUser: async (id, data) => {
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
        },

        createUser: async (data: UserDAO) => {
            const response = await fetch(USER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear usuario');
            }
            return await response.json();
        }
    } as UserRepository;
}