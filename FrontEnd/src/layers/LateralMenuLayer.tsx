import { useState, type ReactNode } from "react"
import { LateralMenu } from "#components/lateralMenu/LateralMenu.tsx"
import LateralMenuItem from "#components/lateralMenu/LateralMenuItem.tsx"
import { Bell, Book, CalendarMonth, Clock, Cog, Home, InfoCircle, MapPinAlt, Plus, Search, User, UsersGroup } from "flowbite-react-icons/outline";
import LateralMenuTitle from "#components/lateralMenu/LateralMenuTitle.tsx";
import Button from "#components/Button.tsx";

interface LateralMenuLayerProps {
    locationId: string;
    children: ReactNode;
}

function LateralMenuLayer({locationId,children}: LateralMenuLayerProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    let permission = 1

    return (
        <div className="flex gap-3 h-full">
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
            <main className="flex-1 flex flex-col">
                <header className="flex justify-end items-center gap-6 pb-4">
                    <span className="flex gap-3">
                        <Button icon={<Search />} className="bg-surface hover:bg-gray-50" />
                        <Button icon={<Bell />} className="bg-surface hover:bg-gray-50" />
                    </span>
                    <span className="flex items-center gap-3 ml-2">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-surface/40">
                            <User className="w-6 h-6" />
                        </div>
                        <div className=" hidden sm:block">
                            <h4 className="text-body-large text-onSurface">Minervis</h4>
                            <p className="text-body-small text-onSurface/70">Coordinadora</p>
                        </div>
                    </span>
                </header>
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
export default LateralMenuLayer