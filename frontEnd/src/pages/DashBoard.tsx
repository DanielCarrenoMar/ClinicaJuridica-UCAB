import Box from "#components/Box.tsx";
import CaseActionCard from "#components/CaseActionCard.tsx";
import CaseActionDetailsDialog from "#components/dialogs/CaseActionDetailsDialog.tsx";
import type { CaseActionModel } from "#domain/models/caseAction.ts";
import CasesDonutChart from "#components/CasesDonutChart.tsx";
import { Search } from "flowbite-react-icons/outline";
import { useGetAllCaseActions } from "#domain/useCaseHooks/useCaseActions.ts";
import LoadingSpinner from "#components/LoadingSpinner.tsx";
import { useGetStatusCaseAmounts } from "#domain/useCaseHooks/useCase.ts";
import { useState } from "react";
import LinkButton from "#components/LinkButton.tsx";

function DashBoard() {
    const { caseActions, loading: loadingCaseActions, error: errorCaseActions } = useGetAllCaseActions({page: 1, limit: 15});
    const { statusAmounts } = useGetStatusCaseAmounts();
    const [selectedCaseAction, setSelectedCaseAction] = useState<CaseActionModel | null>(null);
    const [isCaseActionDetailsDialogOpen, setIsCaseActionDetailsDialogOpen] = useState(false);

    return (

        <div className="flex flex-col gap-3 h-full">
            <section className="grid grid-cols-6 gap-3 flex-1 min-h-0">
                <Box className="col-span-4 h-full flex flex-col gap-2 min-h-0">
                    <span className="flex items-center justify-between">
                        <h2 className="text-label-small text-onSurface">Ultimas acciones</h2>
                        <LinkButton variant="outlined" icon={<Search />} to={"/acciones"} />
                    </span>

                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        {loadingCaseActions &&
                            <div className="flex justify-center">
                                <LoadingSpinner />
                            </div>
                        }
                        {
                            errorCaseActions &&
                            <p className="text-body-medium text-error text-center">Error al cargar las acciones de casos.</p>
                        }
                        {
                            caseActions.length === 0 && !loadingCaseActions && !errorCaseActions &&
                            <p className="text-body-medium text-onSurface/70 text-center">No hay acciones de casos disponibles.</p>
                        }
                        {!errorCaseActions && caseActions.map((action, index) => (
                            <CaseActionCard
                                key={index}
                                caseAction={action}
                                onClick={() => {
                                    setSelectedCaseAction(action);
                                    setIsCaseActionDetailsDialogOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </Box>
                <Box className="col-span-2 flex flex-col gap-5">
                    <h2 className="text-label-small text-onSurface mt-2">Estado de Casos</h2>
                    <div className="flex-1 flex mx-4 w-5/6">
                        <CasesDonutChart statusAmounts={statusAmounts} />
                    </div>
                </Box>
            </section>

            <CaseActionDetailsDialog
                open={isCaseActionDetailsDialogOpen}
                onClose={() => setIsCaseActionDetailsDialogOpen(false)}
                caseAction={selectedCaseAction}
            />
        </div>

    );
}
export default DashBoard;