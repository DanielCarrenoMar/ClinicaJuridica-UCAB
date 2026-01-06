import { useRef, useEffect } from 'react';
import { animate } from 'animejs';
import { Search, Close } from "flowbite-react-icons/outline";

interface SearchBarProps {
    variant?: 'filled' | 'outline';
    isOpen: boolean;
    onToggle?: (isOpen: boolean) => void;
    defaultValue?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
}

export default function SearchBar({ variant = 'filled', isOpen, onToggle, defaultValue = '', placeholder = "Buscar", onChange, onSearch }: SearchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  const containerVariantClass =
    variant === 'outline'
      ? 'border border-onSurface/20 hover:border-onSurface/40 bg-surface/70'
      : 'bg-surface/70';

  const openBackground = variant === 'outline' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,1)';
  const closedBackground = variant === 'outline' ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,0.7)';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle && onToggle(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggle]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    if (isOpen) {
      animate(containerRef.current, {
        width: ['40px', '100%'],
        backgroundColor: [closedBackground, openBackground],
        borderRadius: ['100px', '24px'],
        duration: isFirstRender.current ? 0 : 300,
        easing: 'easeOutQuad',
        complete: () => {
            if(inputRef.current) inputRef.current.focus();
        }
      });
    } else {
      animate(containerRef.current, {
        width: ['100%', '40px'],
        backgroundColor: [openBackground, closedBackground],
        borderRadius: ['24px', '100px'],
        duration: isFirstRender.current ? 0 : 300,
        easing: 'easeOutQuad'
      });
    }
    if (isFirstRender.current) isFirstRender.current = false;
  }, [isOpen, openBackground, closedBackground]);

  function searchInputText(){
    const value = inputRef.current?.value || '';
    if (onSearch) onSearch(value);
  }

  return (
    <div 
      ref={containerRef}
      className={`flex items-center overflow-hidden ${containerVariantClass}`}
    >
      <button 
        onClick={() => { 
          if (!isOpen) onToggle && onToggle(true)
          else searchInputText()
        }}
        className="group p-3 flex items-center justify-center cursor-pointer hover:bg-surface rounded-full transition-colors"
      >
        <Search className="group-hover:animate-pulsing group-hover:animate-duration-400" />
      </button>
      <div className={`flex-1 flex items-center gap-2 px-2 min-w-0 opacity-0 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <input 
          ref={inputRef}
          defaultValue={defaultValue}
          type="text" 
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-body-small text-onSurface placeholder:text-onSurface/50 h-full "
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchInputText();
            }
          }}
        />
        <button 
          onClick={() => {
            if (inputRef.current == null) return
            if (inputRef.current.value === '') {
              onToggle && onToggle(false);
              return;
            }
            inputRef.current.value = '';
            inputRef.current.focus();
          }}
          className="group shrink-0 p-1 hover:bg-surface rounded-full cursor-pointer"
        >
          <Close className="group-hover:animate-pulsing group-hover:animate-duration-400" />
        </button>
      </div>
    </div>
  );
}
