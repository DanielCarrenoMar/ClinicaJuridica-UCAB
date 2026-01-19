import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    requiredLevel: number; // The maximum level allowed (e.g., 2 means levels 1 and 2 can access)
    redirectPath?: string;
}

export default function ProtectedRoute({ requiredLevel, redirectPath = '/' }: ProtectedRouteProps) {
    const { permissionLevel, loading } = useAuth();

    // Assuming lower number = higher permission
    // If user's level is greater than required level, they don't have permission
    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center bg-background"><div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!permissionLevel || permissionLevel > requiredLevel) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}
