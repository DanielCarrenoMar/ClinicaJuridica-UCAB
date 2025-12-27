import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'flowbite-react-icons/outline';

// Context definition
interface DropDownContextType {
  selectedValues: (string | number)[];
  toggleOption: (value: string | number) => void;
}

const DropDownContext = createContext<DropDownContextType | undefined>(undefined);

export const useDropDownContext = () => {
  const context = useContext(DropDownContext);
  if (!context) {
    throw new Error('useDropDownContext must be used within a DropDownCheck');
  }
  return context;
};

interface DropDownCheckProps {
  label: string;
  children: ReactNode;
  selectedValues?: (string | number)[]; // Controlled
  onSelectionChange?: (values: (string | number)[]) => void;
}

export default function DropDownCheck({ label, children, selectedValues, onSelectionChange }: DropDownCheckProps) {
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
    <DropDownContext.Provider value={{ selectedValues: currentSelectedValues, toggleOption }}>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-surface/70 border border-black border-solid flex gap-2 h-10 items-center justify-center overflow-clip px-3 py-2.5 rounded-xl cursor-pointer hover:surface transition-colors"
        >
          <p className="font-['Poppins'] text-[13px] text-black text-nowrap">
            {label}
          </p>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 overflow-hidden">
            <div className="py-1 max-h-60 overflow-y-auto" role="none">
              {children}
            </div>
          </div>
        )}
      </div>
    </DropDownContext.Provider>
  );
}
