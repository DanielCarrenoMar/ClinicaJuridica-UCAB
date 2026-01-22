import { useEffect, useMemo, useState } from 'react';
import SearchBar from '#components/SearchBar.tsx';
import Button from '#components/Button.tsx';
import CaseActionCard from '#components/CaseActionCard.tsx';
import AddCaseActionDialog from '#components/dialogs/AddCaseActionDialog.tsx';
import CaseActionDetailsDialog from '#components/dialogs/CaseActionDetailsDialog.tsx';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import type { CaseActionModel } from '#domain/models/caseAction.ts';
import type { UserModel } from '#domain/models/user.ts';
import { useGetCaseActionsByCaseId } from '#domain/useCaseHooks/useCase.ts';
import { useCreateCaseAction } from '#domain/useCaseHooks/useCaseActions.ts';
import { useNotifications } from '#/context/NotificationsContext';
import Fuse from 'fuse.js';
import { ArrowLeft, ArrowRight } from 'flowbite-react-icons/outline';
import type { CaseActionDAO } from '#database/daos/caseActionDAO.ts';

interface CaseHistoryProps {
    caseId: number;
    user: UserModel | null;
}

export default function CaseHistory({ caseId, user }: CaseHistoryProps) {
    const { notyError } = useNotifications();
    const { caseActions, loading: caseActionsLoading, error: caseActionsError, loadCaseActions } = useGetCaseActionsByCaseId(caseId);
    const { createCaseAction: createAction } = useCreateCaseAction();

    const [caseActionSearchQuery, setCaseActionSearchQuery] = useState("");
    const [isAddCaseActionDialogOpen, setIsAddCaseActionDialogOpen] = useState(false);
    const [selectedCaseAction, setSelectedCaseAction] = useState<CaseActionModel | null>(null);
    const [isCaseActionDetailsDialogOpen, setIsCaseActionDetailsDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        loadCaseActions(caseId);
    }, [caseId, loadCaseActions]);

    useEffect(() => {
        setPage(1);
    }, [caseActionSearchQuery]);

    const caseActionsFuse = useMemo(() => {
        return new Fuse(caseActions, {
            keys: [
                { name: 'description', weight: 0.6 },
                { name: 'notes', weight: 0.2 },
                { name: 'userName', weight: 0.2 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 2,
        });
    }, [caseActions]);

    const visibleCaseActions = useMemo(() => {
        const trimmed = caseActionSearchQuery.trim();
        if (trimmed.length === 0) return caseActions;
        return caseActionsFuse.search(trimmed).map(r => r.item);
    }, [caseActions, caseActionsFuse, caseActionSearchQuery]);

    const totalPages = Math.max(1, Math.ceil(visibleCaseActions.length / pageSize));
    const pagedCaseActions = useMemo(() => {
        const start = (page - 1) * pageSize;
        return visibleCaseActions.slice(start, start + pageSize);
    }, [page, pageSize, visibleCaseActions]);

    const canGoPrev = page > 1;
    const canGoNext = page < totalPages;

    return (
        <div className="flex flex-col h-full gap-6">
            <section className="flex justify-between items-center gap-4 max-w-5xl">
                <div className='flex-1'>
                    <SearchBar
                        variant='outline'
                        isOpen={true}
                        placeholder="Buscar acciones..."
                        onChange={setCaseActionSearchQuery}
                    />
                </div>
                <Button variant='outlined' onClick={() => setIsAddCaseActionDialogOpen(true)}>
                    Añadir Acción
                </Button>
            </section>

            <section className="flex-1 flex flex-col pb-20 overflow-y-auto">
                <div className="col-span-4 h-full flex flex-col gap-2">
                    {caseActionsLoading && <LoadingSpinner />}
                    {caseActionsError && <div className="text-error">Error al cargar las acciones: {caseActionsError.message}</div>}
                    {
                        visibleCaseActions.length === 0 ? (
                            <span className="flex flex-col items-center justify-center gap-4 mt-20">
                                <p className="text-body-small">No hay acciones registradas para este caso.</p>
                            </span>
                        ) : (
                            pagedCaseActions
                                .map((caseAction) => (
                                    <CaseActionCard
                                        key={caseAction.actionNumber}
                                        caseAction={caseAction}
                                        onClick={() => {
                                            setSelectedCaseAction(caseAction);
                                            setIsCaseActionDetailsDialogOpen(true);
                                        }}
                                    />
                                ))
                        )
                    }
                </div>
            </section>

            <section className="mt-4 flex items-center justify-between max-w-5xl">
                <Button
                    variant="outlined"
                    icon={<ArrowLeft />}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!canGoPrev || caseActionsLoading}
                >
                    Anterior
                </Button>
                <span className="text-body-small text-onSurface/70">Página {page}</span>
                <Button
                    variant="outlined"
                    icon={<ArrowRight />}
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!canGoNext || caseActionsLoading}
                >
                    Siguiente
                </Button>
            </section>

            <AddCaseActionDialog
                open={isAddCaseActionDialogOpen}
                onClose={() => setIsAddCaseActionDialogOpen(false)}
                onAdd={async (actionData) => {
                    if (!user) return;
                    try {
                        const newAction: CaseActionDAO = {
                            idCase: caseId,
                            actionNumber: 0,
                            description: actionData.description,
                            notes: actionData.notes,
                            userId: user.identityCard,
                            registryDate: ""
                        };
                        await createAction(newAction);
                        loadCaseActions(caseId);
                    } catch (error: any) {
                        notyError(error.message || "Error al crear la acción del caso");
                        console.error("Error creating case action:", error);
                    }
                }}
            />

            <CaseActionDetailsDialog
                open={isCaseActionDetailsDialogOpen}
                onClose={() => setIsCaseActionDetailsDialogOpen(false)}
                caseAction={selectedCaseAction}
            />

        </div>
    );
}
