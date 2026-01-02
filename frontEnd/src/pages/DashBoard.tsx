import Box from "#components/Box.tsx";
import Button from "#components/Button.tsx";

import CaseActionCard from "#components/CaseActionCard.tsx";
import CasesDonutChart from "#components/CasesDonutChart.tsx";
import { Search } from "flowbite-react-icons/outline";
import { useNavigate } from "react-router";
import { useGetAllCaseActions } from "#domain/useCaseHooks/useCaseActions.ts";
import LoadingSpinner from "#components/LoadingSpinner.tsx";
import { useGetStatusCaseAmounts } from "#domain/useCaseHooks/useCase.ts";

function DashBoard() {
    const navigate = useNavigate()
    const { caseActions, loading: loadingCaseActions, error: errorCaseActions } = useGetAllCaseActions();
    const { statusAmounts, loading: loadingStatusAmounts, error: errorStatusAmounts } = useGetStatusCaseAmounts();

    return (
        
            <div className="flex flex-col gap-3 h-full">
                <section className="flex">
                    <Button className="h-14 w-96" onClick={() => navigate('/crearCaso')}>
                        Nuevo Caso
                    </Button>
                </section>
                <section className="grid grid-cols-6 gap-3 flex-1 min-h-0">
                    <Box className="col-span-4 h-full flex flex-col gap-2">
                        <span className="flex items-center justify-between pb-2">
                            <h2 className="text-label-small text-onSurface">Ultimas acciones</h2>
                            <Button icon={<Search />} />
                        </span>
                        
                        <span className="px-0 py-2 text-body-small text-onSurface/70 border-b border-onSurface/10">
                            <ul className="flex gap-5">
                                <li className="flex-1">
                                    <p>Usuario</p>
                                </li>
                                <li className="flex-1">
                                    <p>ID Caso</p>
                                </li>
                                <li className="flex-1">
                                    <p>Fecha Creacion</p>
                                </li>
                                <li className="flex-3">
                                    <p>Descripcción</p>
                                </li>
                            </ul>
                        </span>

                        <div className="flex flex-col gap-2 flex-11">
                            {loadingCaseActions && 
                                <div className="flex justify-center">
                                    <LoadingSpinner />
                                </div>
                            }
                            {
                                errorCaseActions && 
                                <p className="text-error text-center">Error al cargar las acciones de casos.</p>
                            }
                            {!errorCaseActions && caseActions.map((action, index) => (
                                <CaseActionCard 
                                    key={index}
                                    caseAction={action}
                                />
                            ))}
                        </div>
                    </Box>
                    <Box className="col-span-2 h-fit flex flex-col">
                        <h2 className="text-label-small text-onSurface mb-4">Estado de Casos</h2>
                        <div className="flex-1 flex mx-4 max-w-72">
                            <CasesDonutChart statusAmounts={statusAmounts} />
                        </div>
                    </Box>
                </section>
            </div>
        
    );
}
export default DashBoard;