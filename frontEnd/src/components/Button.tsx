import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Plus } from "flowbite-react-icons/outline";

export type ButtonVariant = 'filled' | 'outlined' | 'active' | 'resalted';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

export const baseButtonStyles = `group flex items-center disabled:opacity-50 disabled:cursor-not-allowed border-1 justify-start gap-2 p-3 rounded-full text-body-medium transition-colors duration-200 cursor-pointer`;
  
export const variantButtonStyles = {
  filled: "text-onSurface border border-transparent bg-surface/70 hover:bg-surface",
  outlined: "text-onSurface border border-onSurface/70 bg-surface/70 hover:bg-surface hover:border-onSurface",
  active: "text-surface border border-transparent bg-onSurface",
  resalted: "text-surface border border-surface bg-success hover:bg-success/90"
};

function Button ({ 
  variant = 'filled', 
  icon = <Plus />, 
  className = '',
  children,
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={`${!children && 'w-fit'} ${baseButtonStyles} ${variantButtonStyles[variant]} ${className}`}
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