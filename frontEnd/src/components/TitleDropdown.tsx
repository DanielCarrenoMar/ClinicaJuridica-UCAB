import type { ReactNode } from 'react';
import Dropdown from './Dropdown/Dropdown';

interface TitleDropdownProps {
  label: string;
  children: ReactNode;
  selectedValue?: string | number | null;
  onSelectionChange?: (value: string | number) => void;
  className?: string;
  dropdownLabel?: string;
}

export default function TitleDropdown({ 
  label, 
  children, 
  selectedValue, 
  onSelectionChange,
  className = '',
  dropdownLabel = "Seleccionar"
}: TitleDropdownProps) {
  return (
    <div className={`flex flex-col gap-2 items-start ${className}`}>
      <div className="flex items-center px-1.5 w-full">
        <h4 className="text-body-large text-onSurface">
          {label}
        </h4>
      </div>
      <div className="w-full">
        <Dropdown 
            label={dropdownLabel} 
            selectedValue={selectedValue} 
            onSelectionChange={onSelectionChange}
            showTitle={!selectedValue}
        >
            {children}
        </Dropdown>
      </div>
    </div>
  );
}
