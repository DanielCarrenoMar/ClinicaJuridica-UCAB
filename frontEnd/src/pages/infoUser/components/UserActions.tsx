import CaseActionCard from '#components/CaseActionCard.tsx'
import type { CaseActionModel } from '#domain/models/caseAction.ts'

interface UserActionsProps {
    actions: CaseActionModel[];
    onActionClick: (action: CaseActionModel) => void;
}

export default function UserActions({ actions, onActionClick }: UserActionsProps) {
    return (
        <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-4">
          <div className="grid grid-cols-1 gap-4">
            {actions.length > 0 ? actions.map((action) => (
                <CaseActionCard
                key={`${action.idCase}-${action.actionNumber}`}
                caseAction={action}
                onClick={() => onActionClick(action)}
              />
            )) : <div className="text-center p-4 text-gray-500">No hay acciones realizadas</div>}
          </div>
        </div>
    )
}
