import type { ReactNode } from 'react';
import Dropdown from './Dropdown/Dropdown';

interface TitleDropdownProps {
  label: string;
  children: ReactNode;
  selectedValue?: string | number;
  onSelectionChange?: (value: string | number) => void;
  className?: string;
  dropdownLabel?: string;
  disabled?: boolean;
}

export default function TitleDropdown({
  label,
  children,
  selectedValue,
  onSelectionChange,
  className = '',
  dropdownLabel = "Seleccionar",
  disabled = false
}: TitleDropdownProps) {
  return (
    <div className={`flex flex-col gap-2 items-start ${className}`}>
      <div className="flex items-center w-full">
        <h4 className="text-body-large text-onSurface">
          {label}
        </h4>
      </div>
      <div className="w-full">
        <Dropdown
          label={dropdownLabel}
          selectedValue={selectedValue}
          onSelectionChange={onSelectionChange}
          showTitle={selectedValue === undefined}
          disabled={disabled}
        >
          {children}
        </Dropdown>
      </div>
    </div>
  );
}
