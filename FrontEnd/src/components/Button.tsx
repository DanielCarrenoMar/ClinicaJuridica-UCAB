import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Plus } from "flowbite-react-icons/outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'active';
  icon?: ReactNode;
}

function Button ({ 
  variant = 'filled', 
  icon = <Plus />, 
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = `flex items-center border-1 justify-start gap-2 p-3 rounded-full text-body-medium text-base transition-colors duration-200 cursor-pointer`;
  
  const variantStyles = {
    filled: "text-onSurface border border-transparent bg-surface/70 hover:bg-surface",
    outlined: "text-onSurface border border-onSurface bg-surface/70 hover:bg-surface",
    active: "text-surface border border-transparent bg-onSurface"
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;