import type { UserModel, UserTypeModel } from '#domain/models/user.ts';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
    user: UserModel | null;
    permissionLevel: number;
    login: (mail: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function roleToPermissionLevel(role: UserTypeModel): number {
    switch (role) {
        case "coordinator":
            return 1;
        case "teacher":
            return 2;
        case "student":
            return 3;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserModel | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (mail: string, password: string) => {
        // Mock login logic
        console.log(`Logging in with ${mail} and ${password}`);
        const newUser : UserModel = {
            identityCard: "16000001",
            fullName: "Juan Perez",
            email: mail,
            password: password,
            isActive: true,
            type: "coordinator"
        };
        setUser(newUser);
    };

    const logout = () => {
        setUser(null);
    };

    // Default to a high number (low permission) if no user
    const permissionLevel = user ? roleToPermissionLevel(user.type) : 99;

    return (
        <AuthContext.Provider value={{ user, permissionLevel, login, logout }}>
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
