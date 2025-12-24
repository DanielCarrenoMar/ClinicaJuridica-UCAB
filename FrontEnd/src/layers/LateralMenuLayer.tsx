import type { ReactNode } from "react"
import { useLocation } from "react-router"
import { LateralMenu } from "#components/LateralMenu.tsx"

interface LateralMenuLayerProps {
    children: ReactNode;
}

function LateralMenuLayer({children}: LateralMenuLayerProps) {
    const location = useLocation();

    const getActiveId = (path: string) => {
        if (path === '/') return 'home';
        if (path.startsWith('/users')) return 'users';
        return '';
    };

    return (
        <>
            <LateralMenu activeItemId={getActiveId(location.pathname)} />
        
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </>
    )
}
export default LateralMenuLayer