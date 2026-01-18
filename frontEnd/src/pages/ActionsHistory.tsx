import CaseActionCard from "#components/CaseActionCard.tsx";
import CaseActionDetailsDialog from "#components/dialogs/CaseActionDetailsDialog.tsx";
import type { CaseActionModel } from "#domain/models/caseAction.ts";
import LoadingSpinner from "#components/LoadingSpinner.tsx";
import SearchBar from "#components/SearchBar.tsx";
import { useGetAllCaseActions } from "#domain/useCaseHooks/useCaseActions.ts";
import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import Button from "#components/Button.tsx";
import { ArrowLeft, ArrowRight } from "flowbite-react-icons/outline";

function ActionsHistory() {
    const { caseActions, refresh, loading: loadingCaseActions, error: errorCaseActions } = useGetAllCaseActions();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedCaseAction, setSelectedCaseAction] = useState<CaseActionModel | null>(null);
    const [isCaseActionDetailsDialogOpen, setIsCaseActionDetailsDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 15;

    useEffect(() => {
        refresh({ page, limit: pageSize });
    }, [page, pageSize, refresh]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

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
            location: 0,
            distance: 100,
            minMatchCharLength: 1
        });

        return fuse.search(searchQuery).map(result => result.item);
    }, [caseActions, searchQuery]);

    const canGoPrev = page > 1;
    const canGoNext = !loadingCaseActions && !errorCaseActions && caseActions.length === pageSize;

    return (
        <div className="flex flex-col h-full min-h-0">
            <section className="mb-4 max-w-5xl">
                <SearchBar
                    isOpen={isSearchOpen}
                    onToggle={setIsSearchOpen}
                    placeholder="Buscar acción por usuario, ID de caso o descripción..."
                    onChange={setSearchQuery}
                    onSearch={setSearchQuery}
                />
            </section>
            <section className="flex-1 min-h-0 overflow-y-auto">
                <div className="col-span-4 h-full flex flex-col gap-2 min-h-0 max-w-5xl">
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
            </section>

            <section className="mt-4 flex items-center justify-between max-w-5xl">
                <Button
                    variant="outlined"
                    icon={<ArrowLeft />}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!canGoPrev || loadingCaseActions}
                >
                    Anterior
                </Button>
                <span className="text-body-small text-onSurface/70">Página {page}</span>
                <Button
                    variant="outlined"
                    icon={<ArrowRight />}
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!canGoNext || loadingCaseActions}
                >
                    Siguiente
                </Button>
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
