import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

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

  // Update position when opened
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const updatePosition = () => {
        if (!dropdownRef.current) return;
        
        const rect = dropdownRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

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

  return (
    <DropdownContext.Provider value={{ selectedValues: currentSelectedValues, toggleOption }}>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`bg-surface border border-onSurface border-solid flex gap-2 h-10 items-center justify-center overflow-clip px-3 py-2.5 rounded-xl transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
        >
          <p className="font-['Poppins'] text-[13px] text-onSurface text-nowrap">
            {label}
          </p>

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
        </button>

        {isOpen && createPortal(
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div
              ref={contentRef}
              className="absolute origin-top-left rounded-xl bg-surface border border-onSurface focus:outline-none overflow-hidden shadow-lg pointer-events-auto"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width || 'auto'}px`,
                minWidth: '14rem',
                maxWidth: '20rem'
              }}
            >
              <div className="py-1 max-h-60 overflow-y-auto" role="none">
                {children}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </DropdownContext.Provider>
  );
}
