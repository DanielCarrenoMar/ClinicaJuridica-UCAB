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
