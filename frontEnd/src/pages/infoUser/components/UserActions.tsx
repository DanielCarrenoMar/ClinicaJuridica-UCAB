import CaseActionCard from '#components/CaseActionCard.tsx'
import CaseActionDetailsDialog from '#components/dialogs/CaseActionDetailsDialog.tsx';
import type { CaseActionModel } from '#domain/models/caseAction.ts'
import { useMemo, useState } from 'react';
import Box from '#components/Box.tsx';
import Fuse from 'fuse.js';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import { useGetActionsByUserId } from '#domain/useCaseHooks/useCaseActions.ts';
import SearchBar from '#components/SearchBar.tsx';

interface UserActionsProps {
  userId: string;
}

export default function UserActions({ userId }: UserActionsProps) {
  const { actions, loading, error } = useGetActionsByUserId(userId);

  const [searchQuery, setSearchQuery] = useState('');
  const [showCaseActionDetails, setShowCaseActionDetails] = useState(false);
  const [selectedCaseAction, setSelectedCaseAction] = useState<CaseActionModel | null>(null);

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

  return (
    <div className="flex flex-col h-full">
      <section className="mb-4 max-w-5xl">
        <SearchBar
          isOpen={true}
          placeholder="Buscar acción por usuario, ID de caso o descripción..."
          onChange={setSearchQuery}
        />
      </section>
      <section className="flex-1">
        <div className="col-span-4 h-full flex flex-col gap-2">
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
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
            {!error && filteredActions.map((action, index) => (
              <CaseActionCard
                key={index}
                caseAction={action}
                onClick={() => {
                  setShowCaseActionDetails(true); setSelectedCaseAction(action);
                }}
              />
            ))}
          </div>
          <CaseActionDetailsDialog
            open={showCaseActionDetails}
            onClose={() => setShowCaseActionDetails(false)}
            caseAction={selectedCaseAction}
          />
        </div>
      </section>
    </div>
  )
}
