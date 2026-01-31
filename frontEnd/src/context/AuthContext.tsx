import type { UserModel, UserTypeModel } from '../domain/models/user.ts';
import { createContext, useContext, type ReactNode } from 'react';
import { useGetActualUser, useLoginUser, useLogoutUser } from '../domain/useCaseHooks/useUser.ts';

interface AuthContextType {
    user: UserModel | null;
    permissionLevel: number;
    login: (mail: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function roleToPermissionLevel(role: UserTypeModel): number {
    switch (role) {
        case "Coordinador":
            return 1;
        case "Profesor":
            return 2;
        case "Estudiante":
            return 3;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const { login: loginUser, loading: loginLoading, error, clearError } = useLoginUser();
    const {logout: logoutUser} = useLogoutUser();
    const { user, loading: actualUserLoading, refresh: refreshActualUser } = useGetActualUser();

    const login = async (mail: string, password: string) => {
        const loggedInUser = await loginUser(mail, password);
        if (loggedInUser) {
            refreshActualUser();
        }
    };

    const logout = () => {
        logoutUser().then(() => {
            refreshActualUser();
        });
    };

    const permissionLevel = user ? roleToPermissionLevel(user.type) : 99;
    const loading = loginLoading || actualUserLoading;

    return (
        <AuthContext.Provider value={{ user, permissionLevel, login, logout, loading, error, clearError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
