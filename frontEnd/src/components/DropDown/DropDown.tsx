import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'flowbite-react-icons/outline';

// Context definition
interface DropDownContextType {
  selectedValue: string | number | null;
  selectOption: (value: string | number, label: string) => void;
}

const DropDownContext = createContext<DropDownContextType | undefined>(undefined);

export const useDropDownContext = () => {
  const context = useContext(DropDownContext);
  if (!context) {
    throw new Error('useDropDownContext must be used within a DropDown');
  }
  return context;
};

interface DropDownProps {
  label?: string;
  children: ReactNode;
  selectedValue?: string | number | null; // Controlled
  onSelectionChange?: (value: string | number) => void;
  showTitle?: boolean;
}

export default function DropDown({ label = "Dropdown", children, selectedValue, onSelectionChange, showTitle = false }: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedValue, setInternalSelectedValue] = useState<string | number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSelectedValue = selectedValue !== undefined ? selectedValue : internalSelectedValue;

  const selectOption = (value: string | number, optionLabel: string) => {
    if (onSelectionChange) {
      onSelectionChange(value);
    } else {
      setInternalSelectedValue(value);
    }
    setSelectedLabel(optionLabel);
    setIsOpen(false);
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
    <DropDownContext.Provider value={{ selectedValue: currentSelectedValue, selectOption }}>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-body-medium text-onSurface text-nowrap bg-surface/70 border border-onSurface border-solid flex gap-1.5 h-10 items-center justify-center overflow-clip px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
        >
          {showTitle ? (
             <p>
             {label}
           </p>
          ) : (
            <p>
            {selectedLabel}
          </p>
          )}
         
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 origin-top-right rounded-xl bg-surface/70 border border-onSurface border-solid focus:outline-none z-10 overflow-hidden p-2 flex flex-col gap-1.5">
            {children}
          </div>
        )}
      </div>
    </DropDownContext.Provider>
  );
}
