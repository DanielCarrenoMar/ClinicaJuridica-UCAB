import type { ReactNode } from 'react';
import { Plus } from "flowbite-react-icons/outline";
import { Link, type LinkProps } from 'react-router';
import { baseButtonStyles, variantButtonStyles, type ButtonVariant } from './Button';

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

function LinkButton ({ 
  variant = 'filled', 
  icon = <Plus />, 
  className = '',
  children,
  ...props 
}: LinkButtonProps) {
  return (
    <Link
      className={`${!children && 'w-fit'} ${baseButtonStyles} ${variantButtonStyles[variant]} ${className}`}
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