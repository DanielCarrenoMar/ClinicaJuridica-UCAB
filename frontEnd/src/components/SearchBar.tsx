import { useRef, useEffect } from 'react';
import { animate } from 'animejs';
import { Search, Close } from "flowbite-react-icons/outline";
import { useNavigate } from 'react-router';

interface SearchBarProps {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
    defaultValue?: string;
}

export default function SearchBar({ isOpen, onToggle, defaultValue = '' }: SearchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggle]);

  useEffect(() => {
    if (isOpen) {
      animate("#searchContainer", {
        width: ['40px', '100%'],
        backgroundColor: ['rgba(255,255,255,0.7)', 'rgba(255,255,255,1)'],
        borderRadius: ['100px', '24px'],
        duration: isFirstRender.current ? 0 : 300,
        easing: 'easeOutQuad',
        complete: () => {
            if(inputRef.current) inputRef.current.focus();
        }
      });
    } else {
      animate("#searchContainer", {
        width: ['100%', '40px'],
        backgroundColor: ['rgba(255,255,255,1)', 'rgba(255,255,255,0.7)'],
        borderRadius: ['24px', '100px'],
        duration: isFirstRender.current ? 0 : 300,
        easing: 'easeOutQuad'
      });
    }
    if (isFirstRender.current) isFirstRender.current = false;
  }, [isOpen]);

  function searchInputText(){
    navigate(`/busqueda?q=${encodeURIComponent(inputRef.current?.value || '')}`);
  }

  return (
    <div 
      id='searchContainer'
      ref={containerRef}
      className={`bg-surface/70 flex items-center overflow-hidden`}
    >
      <button 
        onClick={() => { 
          if (!isOpen) onToggle(true)
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
          placeholder="Buscar" 
          className="w-full bg-transparent border-none outline-none text-body-small text-onSurface placeholder:text-onSurface/50 h-full "
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
              onToggle(false);
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
