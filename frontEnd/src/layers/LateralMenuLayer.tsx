import { useEffect, useMemo, useRef, useState } from "react"
import { LateralMenu } from "#components/lateralMenu/LateralMenu.tsx"
import LateralMenuItem from "#components/lateralMenu/LateralMenuItem.tsx"
import { ArrowLeftToBracket, Bell, Book, CalendarMonth, Clipboard, Clock, Cog, Home, InfoCircle, MapPinAlt, Plus, UsersGroup } from "flowbite-react-icons/outline";
import { User } from "flowbite-react-icons/solid";
import LateralMenuTitle from "#components/lateralMenu/LateralMenuTitle.tsx";
import Button from "#components/Button.tsx";
import SearchBar from "#components/SearchBar.tsx";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router";
import { useAuth } from "../context/AuthContext";
import { NotificationsProvider } from "../context/NotificationsContext";
import LoadingSpinner from "#components/LoadingSpinner.tsx";
import { useGetCasesByStudentId } from "#domain/useCaseHooks/useStudent.ts";
import { useGetCasesByTeacherId } from "#domain/useCaseHooks/useTeacher.ts";
import InBox from "#components/InBox.tsx";

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
    const [isAssignedCasesOpen, setIsAssignedCasesOpen] = useState(false);
    const assignedCasesRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const location = useLocation()
    const locationId = location.pathname === '/' ? location.pathname : location.pathname.split('/')[1] as LateralmenuPages
    const [isSearchOpen, setIsSearchOpen] = useState(defaultSearchText !== '');

    const { cases: studentCases, loading: studentCasesLoading, error: studentCasesError, loadCases: loadStudentCases } = useGetCasesByStudentId();
    const { cases: teacherCases, loading: teacherCasesLoading, error: teacherCasesError, loadCases: loadTeacherCases } = useGetCasesByTeacherId();

    const assignedCases = user?.type === 'Estudiante' ? studentCases : teacherCases;
    const assignedCasesLoading = user?.type === 'Estudiante' ? studentCasesLoading : teacherCasesLoading;
    const assignedCasesError = user?.type === 'Estudiante' ? studentCasesError : teacherCasesError;

    const latestAssignedCases = useMemo(() => {
        return [...assignedCases]
            .sort((a, b) => {
                const aDate = a.lastActionDate ?? a.createdAt;
                const bDate = b.lastActionDate ?? b.createdAt;
                return bDate.getTime() - aDate.getTime();
            })
            .slice(0, 3);
    }, [assignedCases]);

    useEffect(() => {
        if (!isAssignedCasesOpen) return;

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            const targetNode = event.target as Node | null;
            if (!assignedCasesRef.current || !targetNode) return;
            if (!assignedCasesRef.current.contains(targetNode)) {
                setIsAssignedCasesOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('touchstart', handlePointerDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('touchstart', handlePointerDown);
        };
    }, [isAssignedCasesOpen]);

    useEffect(() => {
        if (!user) return;
        if (user?.type === 'Estudiante') {
            loadStudentCases(user?.identityCard);
        }else {
            loadTeacherCases(user?.identityCard);
        }
    }, [location.pathname, user]);

    return (
        <div className="flex gap-6 h-full">
            <LateralMenu activeItemId={locationId} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)}>
                <LateralMenuItem id='/' label='Inicio' icon={<Home />} link='/' />
                <LateralMenuItem id='crearCaso' label='Crear Caso' icon={<Plus />} link='/crearCaso' />
                <LateralMenuItem id='busqueda' label='Casos' icon={<Clipboard />} link='/busqueda' />
                <LateralMenuItem id='calendario' label='Calendario' icon={<CalendarMonth />} link='/calendario' />
                <LateralMenuItem id='acciones' label='Historial de Accciones' icon={<Book />} link='/acciones' />
                <LateralMenuItem id='reportes' label='Generar Reportes' icon={<InfoCircle />} link='/reportes' />
                {
                    permissionLevel <= 2 && <>
                        <LateralMenuTitle label='Administración' />
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
                            onSearch={(value) => {
                                const newParams = locationId === 'busqueda'
                                    ? new URLSearchParams(location.search)
                                    : new URLSearchParams();
                                if (value) {
                                    newParams.set('q', value);
                                } else {
                                    newParams.delete('q');
                                }
                                navigate(`/busqueda?${newParams.toString()}`);
                            }}
                            placeholder="Buscar Caso"
                        />
                        <div ref={assignedCasesRef} className="relative">
                            <Button
                                variant={isAssignedCasesOpen ? 'active' : 'filled'}
                                icon={<Bell />}
                                onClick={() => setIsAssignedCasesOpen((prev) => !prev)}
                            />

                            {isAssignedCasesOpen && (
                                <InBox className="absolute right-0 mt-2 w-96 z-50 gap-2">
                                    <header className="flex items-center justify-between gap-4">
                                        <h4 className="text-body-large">Te han asignado a los siguientes casos</h4>
                                        {assignedCasesLoading && <LoadingSpinner />}
                                    </header>

                                    {assignedCasesError && (
                                        <p className="text-body-small text-onSurface/70">
                                            Error cargando casos.
                                        </p>
                                    )}

                                    {!assignedCasesLoading && !assignedCasesError && latestAssignedCases.length === 0 && (
                                        <p className="text-body-small text-onSurface/70">
                                            No tienes casos asignados.
                                        </p>
                                    )}

                                    {!assignedCasesLoading && !assignedCasesError && latestAssignedCases.length > 0 && (
                                        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                                            {latestAssignedCases.map((caseData) => (
                                                <button
                                                    key={caseData.idCase}
                                                    type="button"
                                                    className="text-left items-start flex flex-col py-2.5 px-4 border border-onSurface/20 hover:border-onSurface/40 h-20 rounded-3xl cursor-pointer bg-surface/70 hover:bg-surface transition-colors"
                                                    onClick={() => {
                                                        setIsAssignedCasesOpen(false);
                                                        navigate(`/caso/${caseData.idCase}`);
                                                    }}
                                                >
                                                    <div className="flex justify-between gap-3">
                                                        <h5 className="text-body-small text-onSurface truncate">
                                                            {caseData.compoundKey}
                                                        </h5>
                                                        <span className="text-body-small text-onSurface/70 shrink-0">
                                                            {(caseData.lastActionDate ?? caseData.createdAt).toLocaleDateString('es-ES')}
                                                        </span>
                                                    </div>
                                                    <p className="text-body-small text-onSurface/70 line-clamp-2">
                                                        {caseData.problemSummary}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </InBox>
                            )}
                        </div>
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
                    <NotificationsProvider>
                        <Outlet context={{ setDefaultSearchText }} />
                    </NotificationsProvider>
                </div>
            </main>
        </div>
    )
}
export default LateralMenuLayer