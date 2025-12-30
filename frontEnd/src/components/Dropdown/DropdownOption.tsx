import type { ReactNode } from 'react';
import { useDropdownContext } from './Dropdown';

interface DropdownOptionProps {
  value: string | number;
  children: string; // Enforcing string children for label display in parent
  icon?: ReactNode;
  circleIcon?: boolean;
}

export default function DropdownOption({ value, children, icon, circleIcon = false }: DropdownOptionProps) {
  const { selectedValue, selectOption } = useDropdownContext();
  const isSelected = selectedValue === value;

  return (
    <div
      className={`group flex items-center gap-1.5 p-2 rounded-lg cursor-pointer select-none w-full transition-colors ${isSelected ? 'text-body-large' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        selectOption(value, children);
      }}
    >
      {icon && (
        <div className="flex items-center justify-center group-hover:animate-pulsing group-hover:animate-duration-400">
             {icon}
        </div>
      )}
      
      <p className="text-body-medium text-onSurface text-nowrap grow">
        {children}
      </p>

      {circleIcon && (
        <div className="relative shrink-0 size-2.5 rounded-full bg-success" />
      )}
    </div>
  );
}
