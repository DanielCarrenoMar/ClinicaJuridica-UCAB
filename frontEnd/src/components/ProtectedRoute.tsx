import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    requiredLevel: number; // The maximum level allowed (e.g., 2 means levels 1 and 2 can access)
    redirectPath?: string;
}

export default function ProtectedRoute({ requiredLevel, redirectPath = '/' }: ProtectedRouteProps) {
    const { permissionLevel } = useAuth();

    // Assuming lower number = higher permission
    // If user's level is greater than required level, they don't have permission
    if (permissionLevel > requiredLevel) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}
