import { HTMLAttributes } from 'react';
import { Link } from 'react-router';

interface AccionCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  id: string;
  date: string;
  description: string;
}

export default function AccionCard({ 
  name, 
  id, 
  date, 
  description,
  className = '',
  ...props 
}: AccionCardProps) {
  return (
    <div 
      className={`flex items-start gap-5 py-2.5 rounded-xl text-onSurface w-full ${className}`}
      {...props}
    >
      <Link to={`/usuario/${id}`} className="text-body-large flex-1 hover:underline">
        {name}
      </Link>
      <Link to={`/caso/${id}`} className="text-body-medium flex-1 hover:underline">
        {id}
      </Link>
      <p className="text-body-small flex-1">
        {date}
      </p>
      <div className="text-body-small flex-3">
        <p>{description}</p>
      </div>
    </div>
  );
}
