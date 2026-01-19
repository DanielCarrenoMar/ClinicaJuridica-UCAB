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
    <span
      onClick={onClick}
      className={`flex flex-col border max-w-5xl border-onSurface/20 hover:border-onSurface/40 gap-1 items-start w-full px-4 py-2.5 rounded-3xl hover:bg-surface bg-surface/70 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <header className='flex items-end justify-between w-full'>
        <span className='flex flex-wrap text-body-small gap-2'>
          {
            caseAction.caseCompoundKey &&
            <p>
              Caso &nbsp;
              <Link
                to={`/caso/${caseAction.idCase}`}
                className="text-body-large truncate hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {caseAction.caseCompoundKey}
              </Link>
              &nbsp;
            </p>
          }
          <p>
            Responsable &nbsp;
            <Link
              to={`/usuario/${caseAction.userId}`}
              className="text-body-large truncate hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {caseAction.userName}
            </Link>
          </p>
        </span>
        <span className="text-body-medium">
          {dateString}
        </span>
      </header>
      <p className="text-body-small text-onSurface/70 line-clamp-3 text-ellipsis max-w-full whitespace-pre-line">
        {caseAction.description}
      </p>
    </span>
  );
}
