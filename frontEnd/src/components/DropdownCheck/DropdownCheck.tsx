import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'flowbite-react-icons/outline';

// Context definition
interface DropdownContextType {
  selectedValues: (string | number)[];
  toggleOption: (value: string | number) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a DropdownCheck');
  }
  return context;
};

interface DropdownCheckProps {
  label: string;
  children: ReactNode;
  selectedValues?: (string | number)[]; // Controlled
  onSelectionChange?: (values: (string | number)[]) => void;
  disabled?: boolean;
  showSelectedCountBadge?: boolean;
}

export default function DropdownCheck({
  label,
  children,
  selectedValues,
  onSelectionChange,
  disabled = false,
  showSelectedCountBadge = false,
}: DropdownCheckProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedValues, setInternalSelectedValues] = useState<(string | number)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSelectedValues = selectedValues ?? internalSelectedValues;

  const toggleOption = (value: string | number) => {
    const newValues = currentSelectedValues.includes(value)
      ? currentSelectedValues.filter((v) => v !== value)
      : [...currentSelectedValues, value];

    if (onSelectionChange) {
      onSelectionChange(newValues);
    } else {
      setInternalSelectedValues(newValues);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <DropdownContext.Provider value={{ selectedValues: currentSelectedValues, toggleOption }}>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`bg-surface border border-onSurface border-solid flex gap-2 h-10 items-center justify-center overflow-clip px-3 py-2.5 rounded-xl transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
        >
          <p className="text-body-medium text-nowrap">
            {label}
          </p>

          <div className='flex'>
            {showSelectedCountBadge && (
              <span
                className={`text-surface text-body-small leading-none rounded-full h-5 min-w-5 px-1 flex items-center justify-center transition-colors duration-200 ${
                  currentSelectedValues.length > 0 ? 'bg-success' : 'bg-onSurface/30 opacity-70'
                }`}
                aria-label={`${currentSelectedValues.length} opciones activas`}
              >
                {currentSelectedValues.length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 min-w-56 w-max max-w-[20rem] origin-top-right rounded-md bg-surface border border-onSurface focus:outline-none z-10 overflow-hidden shadow-lg">
            <div className="py-1 max-h-60 overflow-y-auto" role="none">
              {children}
            </div>
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
}
