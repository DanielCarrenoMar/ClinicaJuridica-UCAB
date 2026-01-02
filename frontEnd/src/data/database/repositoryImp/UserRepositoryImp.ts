import type { UserRepository } from "#domain/repositories.ts";
import { USER_URL } from "./apiUrl";
import type { UserDAO } from "#database/daos/userDAO.ts";
import { daoToUserModel } from "#domain/models/user.ts";
export function getUserRepository(): UserRepository {
    return {
        findUserById: async (id) => {
            const responseUser = await fetch(`${USER_URL}/${id}`);
            if (!responseUser.ok) return null;
            const userData = await responseUser.json();
            const userDAO: UserDAO = userData.data;
            return daoToUserModel(userDAO);
        },

    } as UserRepository;
}