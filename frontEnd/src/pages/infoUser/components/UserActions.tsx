import CaseActionCard from '#components/CaseActionCard.tsx'
import CaseActionDetailsDialog from '#components/dialogs/CaseActionDetailsDialog.tsx';
import type { CaseActionModel } from '#domain/models/caseAction.ts'
import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import { useGetActionsByUserId } from '#domain/useCaseHooks/useCaseActions.ts';
import SearchBar from '#components/SearchBar.tsx';
import Button from '#components/Button.tsx';
import { ArrowLeft, ArrowRight } from 'flowbite-react-icons/outline';

interface UserActionsProps {
  userId: string;
}

export default function UserActions({ userId }: UserActionsProps) {
  const { actions, loading, error, refresh } = useGetActionsByUserId(userId);

  const [searchQuery, setSearchQuery] = useState('');
  const [showCaseActionDetails, setShowCaseActionDetails] = useState(false);
  const [selectedCaseAction, setSelectedCaseAction] = useState<CaseActionModel | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    if (!userId) return;
    refresh();
  }, [refresh, userId]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const filteredActions: CaseActionModel[] = useMemo(() => {
    if (!searchQuery) return actions;

    const fuse = new Fuse<CaseActionModel>(actions, {
      keys: [
        'userName',
        'caseCompoundKey',
        'description',
        'idCase'
      ],
      threshold: 0.3,
    });

    return fuse.search(searchQuery).map(result => result.item);
  }, [actions, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredActions.length / pageSize));
  const pagedActions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredActions.slice(start, start + pageSize);
  }, [filteredActions, page, pageSize]);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex flex-col h-full min-h-0">
      <section className="mb-4 max-w-5xl">
        <SearchBar
          isOpen={true}
          placeholder="Buscar acción por usuario, ID de caso o descripción..."
          onChange={setSearchQuery}
        />
      </section>
      <section className="flex-1 min-h-0 col-span-4 flex flex-col gap-2 overflow-y-auto">
            {loading &&
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            }
            {
              error &&
              <p className="text-error text-center">Error al cargar las acciones de casos.</p>
            }
            {
              actions.length === 0 && !loading && !error &&
              <p className="text-body-medium text-onSurface/70 text-center">No hay acciones de casos disponibles.</p>
            }
            {!error && pagedActions.map((action, index) => (
              <CaseActionCard
                key={index}
                caseAction={action}
                onClick={() => {
                  setShowCaseActionDetails(true); setSelectedCaseAction(action);
                }}
              />
            ))}
          <CaseActionDetailsDialog
            open={showCaseActionDetails}
            onClose={() => setShowCaseActionDetails(false)}
            caseAction={selectedCaseAction}
          />
      </section>

      <section className="mt-4 flex items-center justify-between max-w-5xl">
        <Button
          variant="outlined"
          icon={<ArrowLeft />}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={!canGoPrev || loading}
        >
          Anterior
        </Button>
        <span className="text-body-small text-onSurface/70">Página {page}</span>
        <Button
          variant="outlined"
          icon={<ArrowRight />}
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!canGoNext || loading}
        >
          Siguiente
        </Button>
      </section>
    </div>
  )
}
