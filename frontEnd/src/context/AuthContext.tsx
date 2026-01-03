import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    permissionLevel: number; // 1: Super Admin, 2: Admin, 3: User
}

interface AuthContextType {
    user: User | null;
    permissionLevel: number;
    login: (mail: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
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
        const newUser = {
            id: 1,
            name: "Usuario Demo",
            permissionLevel: 1
        };
        setUser(newUser);
    };

    const logout = () => {
        setUser(null);
    };

    // Default to a high number (low permission) if no user
    const permissionLevel = user ? user.permissionLevel : 99;

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
