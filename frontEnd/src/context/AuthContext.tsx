import type { UserModel, UserTypeModel } from '#domain/models/user.ts';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getUserRepository } from '#database/repositoryImp/UserRepositoryImp.ts';

interface AuthContextType {
    user: UserModel | null;
    permissionLevel: number;
    login: (mail: string, password: string) => Promise<void>;
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

    const login = async (mail: string, password: string) => {
        console.log('🔐 Iniciando login con:', { email: mail, password: '***' });
        
        try {
            const userRepository = getUserRepository();
            const user = await userRepository.authenticate(mail, password);
            
            console.log('👤 User authenticated:', user);
            setUser(user);
        } catch (error) {
            console.error('💥 Error en login:', error);
            throw error;
        }
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
