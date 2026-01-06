import type { UserModel, UserTypeModel } from '#domain/models/user.ts';
import { userTypeDaoToModel } from '#domain/models/user.ts';
import { typeDaoToGenderTypeModel } from '#domain/typesModel.ts';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
            const response = await fetch('http://localhost:3000/api/v1/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: mail, password })
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Error response:', errorData);
                throw new Error(errorData.message || 'Error en autenticación');
            }

            const result = await response.json();
            console.log('✅ Login response:', result);
            
            if (!result.success) {
                console.error('❌ Login failed:', result.message);
                throw new Error(result.message || 'Credenciales inválidas');
            }

            // Convertir DAO a UserModel usando las funciones de conversión
            const userDAO = result.data;
            const user: UserModel = {
                identityCard: userDAO.identityCard,
                fullName: userDAO.fullName,
                gender: userDAO.gender ? typeDaoToGenderTypeModel(userDAO.gender) : undefined,
                email: userDAO.email,
                password: userDAO.password,
                isActive: userDAO.isActive,
                type: userTypeDaoToModel(userDAO.type)
            };
            
            console.log('👤 User model created:', user);
            setUser(user);
        } catch (error) {
            console.error('💥 Error en login:', error);
            throw error; // Re-lanzar para que el Login.tsx pueda manejarlo
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
