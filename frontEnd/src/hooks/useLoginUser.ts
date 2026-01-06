import { useState } from 'react';
import { getUserRepository } from '../data/database/repositoryImp/UserRepositoryImp.ts';
import type { UserModel } from '../domain/models/user.ts';

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
