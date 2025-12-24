import { useState, type ReactNode } from "react"
import { LateralMenu } from "#components/lateralMenu/LateralMenu.tsx"
import LateralMenuItem from "#components/lateralMenu/LateralMenuItem.tsx"
import { Book, CalendarMonth, Home, Plus, User } from "flowbite-react-icons/outline";

interface LateralMenuLayerProps {
    locationId: string;
    children: ReactNode;
}

function LateralMenuLayer({locationId,children}: LateralMenuLayerProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    let role = 'user'

    return (
        <div className="flex">
            <LateralMenu activeItemId={locationId} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)}>
                <LateralMenuItem id='home' label='Inicio' icon={<Home />} link='/' />
                <LateralMenuItem id='createCase' label='Crear Caso' icon={<Plus />} link='/createCase' />
                <LateralMenuItem id='calendar' label='Calendario' icon={<CalendarMonth />} link='/calendar' />
                <LateralMenuItem id='actions' label='Historial de Accciones' icon={<Book />} link='/actions' />
                <LateralMenuItem id='users' label='Usuarios' icon={<User />} link='/users' />
                {
                    role === 'teacher' && <>
                        <LateralMenuItem id='adminPanel' label='Panel Admin' icon={<User />} link='/adminPanel' />
                    </>
                }
                {
                    role === 'admin' && <>
                        <LateralMenuItem id='users' label='Usuarios' icon={<User />} link='/users' />
                        <LateralMenuItem id='users' label='Usuarios' icon={<User />} link='/users' />
                    </>
                }
            </LateralMenu>
            <main>
                {children}
            </main>
        </div>
    )
}
export default LateralMenuLayer