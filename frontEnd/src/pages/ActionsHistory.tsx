import Box from "#components/Box.tsx";
import CaseActionCard from "#components/CaseActionCard.tsx";
import LoadingSpinner from "#components/LoadingSpinner.tsx";
import TextInput from "#components/TextInput.tsx";
import { useGetAllCaseActions } from "#domain/useCaseHooks/useCaseActions.ts";

function ActionsHistory() {
    const { caseActions, loading: loadingCaseActions, error: errorCaseActions } = useGetAllCaseActions();

    return (
        <div>
            <section>
                
            </section>
            <section>
                <Box className="col-span-4 h-full flex flex-col gap-2">
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
            </section>
        </div>
    );
}
export default ActionsHistory;
