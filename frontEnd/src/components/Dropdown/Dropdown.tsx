import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'flowbite-react-icons/outline';

// Context definition
interface DropdownContextType {
  selectedValue: string | number | null;
  selectOption: (value: string | number, label: string) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a Dropdown');
  }
  return context;
};

interface DropdownProps {
  label?: string;
  children: ReactNode;
  selectedValue?: string | number | null; // Controlled
  onSelectionChange?: (value: string | number) => void;
  showTitle?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
}

export default function Dropdown({
  label = "Seleccionar",
  children,
  selectedValue,
  onSelectionChange,
  showTitle = false,
  disabled = false,
  triggerClassName = ""
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedValue, setInternalSelectedValue] = useState<string | number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(label);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        (!contentRef.current || !contentRef.current.contains(event.target as Node))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, contentRef]);

  const getDropdownPosition = () => {
    if (!dropdownRef.current) return { top: 0, left: 0 };

    const rect = dropdownRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX
    };
  };

  const dropdownContent = isOpen ? createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        ref={contentRef}
        className="absolute mt-2 origin-top-right rounded-xl bg-surface border border-onSurface border-solid focus:outline-none max-h-60 overflow-y-auto p-2 flex flex-col gap-1.5 pointer-events-auto shadow-lg"
        style={getDropdownPosition()}
      >
        {children}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <DropdownContext.Provider value={{ selectedValue: currentSelectedValue, selectOption }}>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`text-body-medium text-onSurface text-nowrap bg-surface border border-onSurface border-solid flex gap-1.5 h-10 items-center justify-center overflow-clip px-3 py-2.5 rounded-xl transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
            } ${triggerClassName}`}
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

        {dropdownContent}
      </div>
    </DropdownContext.Provider>
  );
}
