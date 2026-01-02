import type { CaseActionModel } from '#domain/models/caseAction.ts';
import type { HTMLAttributes } from 'react';
import { Link } from 'react-router';

interface AccionCardProps extends HTMLAttributes<HTMLDivElement> {
  caseAction: CaseActionModel
}

export default function CaseActionCard({ 
  caseAction,
  className = '',
  ...props 
}: AccionCardProps) {
  return (
    <div 
      className={`flex items-start gap-5 py-2.5 rounded-xl text-onSurface w-full ${className}`}
      {...props}
    >
      <Link to={`/usuario/${caseAction.userId}`} className="text-body-large flex-1 hover:underline">
        {caseAction.userName}
      </Link>
      <Link to={`/caso/${caseAction.caseCompoundKey}`} className="text-body-medium flex-1 hover:underline">
        {caseAction.caseCompoundKey}
      </Link>
      <p className="text-body-small flex-1">
        {caseAction.registryDate.toLocaleDateString()}
      </p>
      <div className="text-body-small flex-3">
        <p>{caseAction.description}</p>
      </div>
    </div>
  );
}
