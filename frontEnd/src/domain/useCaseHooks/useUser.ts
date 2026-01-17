import type { UserDAO } from "#database/daos/userDAO.ts";
import { getUserRepository } from "#database/repositoryImp/UserRepositoryImp.ts";
import type { UserModel } from "#domain/models/user.ts";
import { useCallback, useEffect, useState } from "react";

export function useGetAllUsers() {
	const { findAllUsers } = getUserRepository();
	const [users, setUsers] = useState<UserModel[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadUsers = useCallback(async () => {
		setLoading(true);
		try {
			const data = await findAllUsers();
			setUsers(data);
			setError(null);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	return {
		users,
		loading,
		error,
		refresh: loadUsers,
	};
}

export function useGetUserById(id: string) {
	const { findUserById } = getUserRepository();
	const [user, setUser] = useState<UserModel | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadUser = useCallback(async (userId: string) => {
		setLoading(true);
		try {
			const data = await findUserById(userId);
			setUser(data);
			setError(null);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!id) {
			setUser(null);
			setLoading(false);
			return;
		}

		loadUser(id);
	}, [id, loadUser]);

	return {
		user,
		loading,
		error,
		loadUser,
	};
}

export function useLoginUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (email: string, password: string): Promise<UserModel | null> => {
		setLoading(true);
		setError(null);

		try {
			const userRepository = getUserRepository();
			const user = await userRepository.authenticate(email, password);
			setLoading(false);
			return user;
		} catch (err) {
			setLoading(false);
			const errorMessage = err instanceof Error ? err.message : 'Error desconocido en el login';
			setError(errorMessage);
			return null;
		}
	};

	const clearError = () => {
		setError(null);
	};

	return {
		login,
		loading,
		error,
		clearError
	};
}

export function useUpdateUserById() {
	const { updateUser: updateUserData  } = getUserRepository();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const updateUserById = useCallback(async (id: string, data: Partial<UserDAO>) => {
		setLoading(true);
		try {
			await updateUserData(id, data);
			setError(null);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}	
	}, [updateUserData]);

	return {
		updateUserById,
		loading,
		error,
	};
}
