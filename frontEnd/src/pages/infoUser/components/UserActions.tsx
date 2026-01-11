import CaseActionCard from '#components/CaseActionCard.tsx'
import CaseActionDetailsDialog from '#components/dialogs/CaseActionDetailsDialog.tsx';
import type { CaseActionModel } from '#domain/models/caseAction.ts'
import { useState } from 'react';

interface UserActionsProps {
    userId: string;
}

export default function UserActions({ userId }: UserActionsProps) {
    const actions: CaseActionModel[] = [] //Implementar getActionsByUserId(userId);

    const [showCaseActionDetails, setShowCaseActionDetails] = useState(false);
    const [selectedCaseAction, setSelectedCaseAction] = useState<CaseActionModel | null>(null);

    return (
        <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-4">
          <div className="grid grid-cols-1 gap-4">
            {actions.length > 0 ? actions.map((action) => (
                <CaseActionCard
                key={`${action.idCase}-${action.actionNumber}`}
                caseAction={action}
                onClick={() => { setShowCaseActionDetails(true); setSelectedCaseAction(action); }}
              />
            )) : <div className="text-center p-4 text-gray-500">No hay acciones realizadas</div>}
          </div>
          <CaseActionDetailsDialog
            open={showCaseActionDetails}
            onClose={() => setShowCaseActionDetails(false)}
            caseAction={selectedCaseAction}
          />
        </div>
    )
}
