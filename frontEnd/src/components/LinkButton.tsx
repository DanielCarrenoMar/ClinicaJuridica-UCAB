import type { ReactNode } from 'react';
import { Plus } from "flowbite-react-icons/outline";
import { Link, type LinkProps } from 'react-router';

interface LinkButtonProps extends LinkProps {
  variant?: 'filled' | 'outlined' | 'active' | 'resalted';
  icon?: ReactNode;
}

function LinkButton ({ 
  variant = 'filled', 
  icon = <Plus />, 
  className = '',
  children,
  ...props 
}: LinkButtonProps) {
  const baseStyles = `group flex items-center disabled:opacity-50 disabled:cursor-not-allowed border-1 justify-start gap-2 p-3 rounded-full text-body-medium transition-colors duration-200 cursor-pointer ${!children && 'w-fit'}`;
  
  const variantStyles = {
    filled: "text-onSurface border border-transparent bg-surface/70 hover:bg-surface",
    outlined: "text-onSurface border border-onSurface bg-surface/70 hover:bg-surface",
    active: "text-surface border border-transparent bg-onSurface",
    resalted: "text-surface border border-surface bg-success hover:bg-success/90"
  };

  return (
    <Link
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <span className="group-hover:animate-pulsing group-hover:animate-duration-400">
        {icon}
      </span>
      {children}
    </Link>
  );
};

export default LinkButton;