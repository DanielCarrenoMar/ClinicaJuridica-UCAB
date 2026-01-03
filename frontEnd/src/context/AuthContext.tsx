import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    permissionLevel: number; // 1: Super Admin, 2: Admin, 3: User
}

interface AuthContextType {
    user: User | null;
    permissionLevel: number;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Mock initial user for demonstration
    const [user, setUser] = useState<User | null>({
        id: 1,
        name: "Minervis",
        permissionLevel: 1 
    });

    const login = (userData: User) => {
        setUser(userData);
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
