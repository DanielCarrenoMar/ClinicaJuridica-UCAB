import type { UserModel, UserTypeModel } from '../domain/models/user.ts';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLoginUser } from '../domain/useCaseHooks/useUser.ts';

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

function roleToPermissionLevel(role: UserTypeModel): number {
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
    const [user, setUser] = useState<UserModel | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const { login: loginUser, loading, error, clearError } = useLoginUser();

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (mail: string, password: string) => {
        const loggedInUser = await loginUser(mail, password);
        if (loggedInUser) {
            setUser(loggedInUser);
        }
    };

    const logout = () => {
        setUser(null);
        clearError();
    };

    // Default to a high number (low permission) if no user
    const permissionLevel = user ? roleToPermissionLevel(user.type) : 99;

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
