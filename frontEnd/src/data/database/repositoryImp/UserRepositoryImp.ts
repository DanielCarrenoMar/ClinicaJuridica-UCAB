import type { UserRepository } from "#domain/repositories.ts";
import { USER_URL } from "./apiUrl";
import { dtoToUserModel } from "#domain/models/user.ts";
import type { PacketDTO } from "@app/shared/dtos/packets/PacketDTO";
import type { UserResDTO } from "@app/shared/dtos/UserDTO";

const AUTH_URL = "http://localhost:3000/api/v1/auth";

export function getUserRepository(): UserRepository {
    return {
        findAllUsers: async (params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString() ? `${USER_URL}?${query.toString()}` : USER_URL;
            const responseUsers = await fetch(url, { method: 'GET', credentials: 'include' });
            const usersData = await responseUsers.json();
            if (!responseUsers.ok) throw new Error(usersData.message || 'Error fetching users');
            const usersDAO: UserResDTO[] = usersData.data;
            return usersDAO.map(dtoToUserModel);
        },
        findUserById: async (id) => {
            const responseUser = await fetch(`${USER_URL}/${id}`, { method: 'GET', credentials: 'include' });
            const userData = await responseUser.json();
            if (!responseUser.ok) throw new Error(userData.message || 'Error fetching user');
            const userDTO: UserResDTO = userData.data;
            return dtoToUserModel(userDTO);
        },
        authenticate: async (email, password) => {
            const response = await fetch(`${AUTH_URL}/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result: PacketDTO = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error en autenticación');
            if (!result.success) throw new Error(result.message || 'Credenciales inválidas');
        },
        changeLoginlUserPassword: async (currentPassword, newPassword) => {
            const response = await fetch(`${AUTH_URL}/change-password`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const result: PacketDTO = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error changing password');
            return result.success;
        },
        logout: async () => {
            const response = await fetch(`${AUTH_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Error during logout');
            }
        },
        findActualUser: async () => {
            const response = await fetch(`${AUTH_URL}/me`, { method: 'POST', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error en autenticación');
            const userDTO: UserResDTO = result.data;
            return dtoToUserModel(userDTO);
        },
        updateUser: async (id, data) => {
            const response = await fetch(`${USER_URL}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error al actualizar el usuario');
            const updatedUserResDTO: UserResDTO = result.data;
            return dtoToUserModel(updatedUserResDTO);
        },

        createUser: async (data: UserResDTO) => {
            const response = await fetch(USER_URL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error al crear usuario');
            return result;
        }
    } as UserRepository;
}