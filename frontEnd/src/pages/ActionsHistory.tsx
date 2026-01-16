import Box from "#components/Box.tsx";
import CaseActionCard from "#components/CaseActionCard.tsx";
import CaseActionDetailsDialog from "#components/dialogs/CaseActionDetailsDialog.tsx";
import type { CaseActionModel } from "#domain/models/caseAction.ts";
import LoadingSpinner from "#components/LoadingSpinner.tsx";
import SearchBar from "#components/SearchBar.tsx";
import { useGetAllCaseActions } from "#domain/useCaseHooks/useCaseActions.ts";
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

function ActionsHistory() {
    const { caseActions, loading: loadingCaseActions, error: errorCaseActions } = useGetAllCaseActions();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCaseAction, setSelectedCaseAction] = useState<CaseActionModel | null>(null);
    const [isCaseActionDetailsDialogOpen, setIsCaseActionDetailsDialogOpen] = useState(false);

    const filteredActions = useMemo(() => {
        if (!searchQuery) return caseActions;

        const fuse = new Fuse(caseActions, {
            keys: [
                'userName',
                'caseCompoundKey',
                'description',
                'idCase'
            ],
            threshold: 0.3,
        });

        return fuse.search(searchQuery).map(result => result.item);
    }, [caseActions, searchQuery]);

    return (
        <div className="flex flex-col h-full">
            <section className="mb-4">
                <SearchBar
                    isOpen={true}
                    placeholder="Buscar acción por usuario, ID de caso o descripción..."
                    onChange={setSearchQuery}
                />
            </section>
            <section className="flex-1">
                <Box className="col-span-4 h-full flex flex-col gap-2">
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
                        {
                            caseActions.length === 0 && !loadingCaseActions && !errorCaseActions &&
                            <p className="text-body-medium text-onSurface/70 text-center">No hay acciones de casos disponibles.</p>
                        }
                        {!errorCaseActions && filteredActions.map((action, index) => (
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
            </section>

            <CaseActionDetailsDialog
                open={isCaseActionDetailsDialogOpen}
                onClose={() => setIsCaseActionDetailsDialogOpen(false)}
                caseAction={selectedCaseAction}
            />
        </div>
    );
}
export default ActionsHistory;
