import { ClipboardList } from 'flowbite-react-icons/solid';
import type { CaseActionModel } from '#domain/models/caseAction.ts';
import { Link } from 'react-router';

interface CaseActionCardProps {
  caseAction: CaseActionModel;
  className?: string;
  onClick?: () => void;
}

export default function CaseActionCard({
  caseAction,
  className = '',
  onClick
}: CaseActionCardProps) {
  const dateString = caseAction.registryDate.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div
      onClick={onClick}
      className={`group w-full p-4 rounded-xl bg-surface border border-onSurface/10 hover:border-onSurface/30 hover:shadow-sm transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex gap-4 items-start">
        {/* Icon */}
        <div className="shrink-0 w-12 h-12 bg-surfaceVariant/30 rounded-lg flex items-center justify-center text-onSurfaceVariant">
          <ClipboardList className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-col gap-1">
              <Link
                to={`/usuario/${caseAction.userId}`}
                className="text-title-medium text-onSurface font-bold hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {caseAction.userName}
              </Link>
              <Link
                to={`/caso/${caseAction.idCase}`}
                className="text-body-small text-onSurfaceVariant hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Caso: {caseAction.caseCompoundKey}
              </Link>
            </div>
            <span className="text-body-small text-onSurfaceVariant shrink-0">
              {dateString}
            </span>
          </div>

          <p className="text-body-medium text-onSurface/80 line-clamp-1">
            {caseAction.description}
          </p>

          {caseAction.notes && (
            <p className="text-body-small text-onSurface/60 italic line-clamp-1">
              Nota: {caseAction.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
