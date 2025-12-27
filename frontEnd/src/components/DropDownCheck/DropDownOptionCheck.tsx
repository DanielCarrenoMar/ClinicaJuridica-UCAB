import type { ReactNode } from 'react';
import { useDropDownContext } from './DropDownCheck';

interface DropDownOptionCheckProps {
  value: string | number;
  children: ReactNode;
}

export default function DropDownOptionCheck({ value, children }: DropDownOptionCheckProps) {
  const { selectedValues, toggleOption } = useDropDownContext();
  const isSelected = selectedValues.includes(value);

  return (
    <div
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer select-none"
      onClick={(e) => {
        e.stopPropagation();
        toggleOption(value);
      }}
    >
      <input
        type="checkbox"
        className="mr-3 h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
        checked={isSelected}
        readOnly
      />
      <span className="font-['Poppins'] text-[13px]">{children}</span>
    </div>
  );
}
