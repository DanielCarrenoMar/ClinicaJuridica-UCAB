import { useState } from "react"
import { LateralMenu } from "#components/lateralMenu/LateralMenu.tsx"
import LateralMenuItem from "#components/lateralMenu/LateralMenuItem.tsx"
import { ArrowLeftToBracket, Bell, Book, CalendarMonth, Clipboard, Clock, Cog, Home, InfoCircle, MapPinAlt, Plus, User, UsersGroup } from "flowbite-react-icons/outline";
import LateralMenuTitle from "#components/lateralMenu/LateralMenuTitle.tsx";
import Button from "#components/Button.tsx";
import SearchBar from "#components/SearchBar.tsx";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router";
import { useAuth } from "../context/AuthContext";

type LateralmenuPages = '/' | 'crearCaso' | 'busqueda' | 'calendario' | 'acciones' | 'reportes' | 'usuarios' | 'semestres' | 'nucleos' | 'configuracion' | "busqueda"; 

export type LateralMenuContext = {
    setDefaultSearchText: (value: string) => void
};

export function useLateralMenuContext() {
    return useOutletContext<LateralMenuContext>();
}

function LateralMenuLayer() {
    const { user, permissionLevel, logout } = useAuth();
    const [defaultSearchText, setDefaultSearchText] = useState("")
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()
    const locationId = location.pathname === '/' ? location.pathname : location.pathname.split('/')[1] as LateralmenuPages
    const [isSearchOpen, setIsSearchOpen] = useState(defaultSearchText !== '');

    return (
        <div className="flex gap-6 h-full">
            <LateralMenu activeItemId={locationId} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)}>
                <LateralMenuItem id='/' label='Inicio' icon={<Home />} link='/' />
                <LateralMenuItem id='crearCaso' label='Crear Caso' icon={<Plus />} link='/crearCaso' />
                <LateralMenuItem id='busqueda' label='Casos' icon={<Clipboard />} link='/busqueda' />
                <LateralMenuItem id='calendario' label='Calendario' icon={<CalendarMonth />} link='/calendario' />
                <LateralMenuItem id='acciones' label='Historial de Accciones' icon={<Book />} link='/acciones' />
                <LateralMenuItem id='reportes' label='Generar Reportes' icon={<InfoCircle />} link='/reportes' />
                <LateralMenuTitle label='Administración' />
                {
                    permissionLevel <= 2 && <>
                        <LateralMenuItem id='usuarios' label='Usuarios' icon={<UsersGroup />} link='/usuarios' />
                    </>
                }
                {
                    permissionLevel <= 1 && <>
                        <LateralMenuItem id='semestres' label='Semestres' icon={<Clock />} link='/semestres' />
                        <LateralMenuItem id='nucleos' label='Nucleos' icon={<MapPinAlt />} link='/nucleos' />
                        <LateralMenuItem id='configuracion' label='Configuración' icon={<Cog />} link='/configuracion' />
                    </>
                }
            </LateralMenu>
            <main className="flex-1 flex flex-col">
                <header className="flex justify-end items-center gap-6 pb-4">
                    <span className="flex flex-1 justify-end gap-3">
                        <SearchBar
                            isOpen={locationId === 'busqueda' || locationId === '/' ? true : isSearchOpen} 
                            onToggle={setIsSearchOpen}
                            defaultValue={defaultSearchText}
                            onSearch={(value)=>{navigate(`/busqueda?q=${encodeURIComponent(value)}`);}}
                            placeholder="Buscar Caso"
                        />
                        <Button icon={<Bell />} className="bg-surface hover:bg-gray-50" />
                    </span>
                    <span className="flex items-center gap-3 ml-2">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-surface/40">
                            <User className="w-6 h-6" />
                        </div>
                        <div className=" hidden sm:block">
                            <h4 className="text-body-large text-onSurface">{user?.fullName || 'Usuario'}</h4>
                            <p className="text-body-small text-onSurface/70">
                                {user?.type || 'Tipo de Usuario'}
                            </p>
                        </div>
                        <Button icon={<ArrowLeftToBracket />} onClick={logout} >
                           Cerrar sesión
                        </Button>
                    </span>
                </header>
                <div className="flex-1 overflow-y-auto">
                    <Outlet context={{ setDefaultSearchText }} />
                </div>
            </main>
        </div>
    )
}
export default LateralMenuLayer