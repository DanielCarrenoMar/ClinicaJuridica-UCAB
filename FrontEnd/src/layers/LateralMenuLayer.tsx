import { useState, type ReactNode } from "react"
import { LateralMenu } from "#components/lateralMenu/LateralMenu.tsx"
import LateralMenuItem from "#components/lateralMenu/LateralMenuItem.tsx"
import { Book, CalendarMonth, Clock, Cog, Home, InfoCircle, MapPinAlt, Plus, User, UsersGroup } from "flowbite-react-icons/outline";
import LateralMenuTitle from "#components/lateralMenu/LateralMenuTitle.tsx";

interface LateralMenuLayerProps {
    locationId: string;
    children: ReactNode;
}

function LateralMenuLayer({locationId,children}: LateralMenuLayerProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    let permission = 1

    return (
        <div className="flex gap-3">
            <LateralMenu activeItemId={locationId} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)}>
                <LateralMenuItem id='home' label='Inicio' icon={<Home />} link='/' />
                <LateralMenuItem id='createCase' label='Crear Caso' icon={<Plus />} link='/crearCaso' />
                <LateralMenuItem id='calendar' label='Calendario' icon={<CalendarMonth />} link='/calendario' />
                <LateralMenuItem id='actions' label='Historial de Accciones' icon={<Book />} link='/acciones' />
                <LateralMenuItem id='reports' label='Generar Reportes' icon={<InfoCircle />} link='/reportes' />
                <LateralMenuTitle label='Administración' />
                {
                    permission <= 2 && <>
                        <LateralMenuItem id='users' label='Usuarios' icon={<UsersGroup />} link='/usuarios' />
                    </>
                }
                {
                    permission <= 1 && <>
                        <LateralMenuItem id='semesters' label='Semestres' icon={<Clock />} link='/semestres' />
                        <LateralMenuItem id='nuclei' label='Nucleos' icon={<MapPinAlt />} link='/nucleos' />
                        <LateralMenuItem id='config' label='Configuración' icon={<Cog />} link='/configuracion' />
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