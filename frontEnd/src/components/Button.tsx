import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Plus } from "flowbite-react-icons/outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'active' | 'resalted';
  icon?: ReactNode;
}

function Button ({ 
  variant = 'filled', 
  icon = <Plus />, 
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = `group flex items-center border-1 justify-start gap-2 p-3 rounded-full text-body-medium transition-colors duration-200 cursor-pointer ${!children && 'w-fit'}`;
  
  const variantStyles = {
    filled: "text-onSurface border border-transparent bg-surface/70 hover:bg-surface",
    outlined: "text-onSurface border border-onSurface bg-surface/70 hover:bg-surface",
    active: "text-surface border border-transparent bg-onSurface",
    resalted: "text-surface border border-surface bg-success hover:bg-success/90"
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <span className="group-hover:animate-pulsing group-hover:animate-duration-400">
        {icon}
      </span>
      {children}
    </button>
  );
};

export default Button;