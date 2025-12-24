import type { ReactNode } from "react"
import { LateralMenu } from "#components/LateralMenu.tsx"
import { Home, User } from "flowbite-react-icons/outline";

interface LateralMenuLayerProps {
    locationId: string;
    children: ReactNode;
}

function LateralMenuLayer({locationId,children}: LateralMenuLayerProps) {
    return (
        <>
            <LateralMenu 
                activeItemId={locationId}
                items={[
                    { id: 'home', label: 'Inicio', icon: <Home />, link: '/' },
                    { id: 'users', label: 'Usuarios', icon: <User />, link: '/users' },
                ]} 
            />
        
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </>
    )
}
export default LateralMenuLayer