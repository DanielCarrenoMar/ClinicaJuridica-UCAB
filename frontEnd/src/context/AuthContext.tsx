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
    const [user, setUser] = useState<UserModel | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const { login: loginUser, loading: loginLoading, error, clearError } = useLoginUser();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setAuthLoading(false);
            return;
        }

        const { email, password } = JSON.parse(storedUser) as { email?: string; password?: string };
        if (!email || !password) {
            localStorage.removeItem('user');
            setAuthLoading(false);
            return;
        }

        void (async () => {
            try {
                const loggedInUser = await loginUser(email, password);
                if (loggedInUser) {
                    setUser(loggedInUser);
                } else {
                    // If login fails (e.g. credential change), clear storage
                    localStorage.removeItem('user');
                }
            } catch (e) {
                console.error("Auto-login failed:", e);
                localStorage.removeItem('user');
            } finally {
                setAuthLoading(false);
            }
        })();
    }, []); // Removed [loginUser] dependency to avoid re-running on loginUser change which shouldn't happen but is safer empty

    const login = async (mail: string, password: string) => {
        const loggedInUser = await loginUser(mail, password);
        if (loggedInUser) {
            localStorage.setItem('user', JSON.stringify({ email: mail, password }));
            setUser(loggedInUser);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        clearError();
    };

    // Default to a high number (low permission) if no user
    const permissionLevel = user ? roleToPermissionLevel(user.type) : 99;
    const loading = loginLoading || authLoading;

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
