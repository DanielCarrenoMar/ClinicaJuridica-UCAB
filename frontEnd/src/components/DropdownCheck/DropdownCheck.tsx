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
}

export default function DropdownCheck({ label, children, selectedValues, onSelectionChange }: DropdownCheckProps) {
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

  // Close on click outside
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
          onClick={() => setIsOpen(!isOpen)}
          className="bg-surface border border-onSurface border-solid flex gap-2 h-10 items-center justify-center overflow-clip px-3 py-2.5 rounded-xl cursor-pointer hover:surface transition-colors"
        >
          <p className="font-['Poppins'] text-[13px] text-onSurface text-nowrap">
            {label}
          </p>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 min-w-[14rem] w-max max-w-[20rem] origin-top-right rounded-md bg-surface border border-onSurface focus:outline-none z-10 overflow-hidden shadow-lg">
            <div className="py-1 max-h-60 overflow-y-auto" role="none">
              {children}
            </div>
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
}
