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
        <div className="flex flex-col">
            <section className="mb-4">
                <SearchBar
                    isOpen={true}
                    placeholder="Buscar acción por usuario, ID de caso o descripción..."
                    onChange={setSearchQuery}
                />
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
