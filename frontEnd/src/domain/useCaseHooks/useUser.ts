import { getUserRepository } from "#database/repositoryImp/UserRepositoryImp.ts";
import type { UserModel } from "#domain/models/user.ts";
import type { UserReqDTO } from "@app/shared/dtos/UserDTO";
import { useCallback, useEffect, useState } from "react";

export function useGetAllUsers() {
	const { findAllUsers } = getUserRepository();
	const [users, setUsers] = useState<UserModel[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadUsers = useCallback(async (params?: { page?: number; limit?: number }) => {
		setLoading(true);
		try {
			const data = await findAllUsers(params);
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

export function useFindUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const findUser = useCallback(async (id: string): Promise<UserModel | null> => {
		const { findUserById } = getUserRepository();
		setLoading(true);
		try {
			const user = await findUserById(id);
			return user;
		} catch (err) {
			setError(err as Error);
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		findUser,
		loading,
		error
	};
}

export function useLoginUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (email: string, password: string): Promise<Boolean> => {
		setLoading(true);
		setError(null);

		try {
			const userRepository = getUserRepository();
			await userRepository.authenticate(email, password);
			setLoading(false);
			return true;
		} catch (err: any) {
			setLoading(false);
			const errorMessage = err.message || 'Error desconocido en el login';
			setError(errorMessage);
			return false;
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

export function useLogoutUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const logout = async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const userRepository = getUserRepository();
			await userRepository.logout();
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Error desconocido en el logout';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return {
		logout,
		loading,
		error
	};
}

export function useGetActualUser() {
	const { findActualUser } = getUserRepository();
	const [user, setUser] = useState<UserModel | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadActualUser = useCallback(async () => {
		setLoading(true);
		try {
			const data = await findActualUser();
			setUser(data);
			setError(null);
		} catch (err) {
			setError(err as Error);
			setUser(null);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [findActualUser]);

	useEffect(() => {
		void loadActualUser();
	}, []);
	return {
		user,
		loading,
		error,
		refresh: loadActualUser,
	};
}

export function useUpdateUserById() {
	const { updateUser: updateUserData } = getUserRepository();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const updateUserById = useCallback(async (id: string, data: Partial<UserReqDTO>) => {
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

export function useCreateUser() {
	const { createUser: createUserRepo } = getUserRepository();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const createUser = useCallback(async (data: UserReqDTO) => {
		setLoading(true);
		try {
			const result = await createUserRepo(data);
			setError(null);
			return result;
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [createUserRepo]);

	return {
		createUser,
		loading,
		error,
	};
}
