import type { ButtonHTMLAttributes, ReactNode, FC } from 'react';
import { Plus } from "flowbite-react-icons/outline";

interface ButtonTextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: 'filled' | 'outlined';
  icon?: ReactNode;
}

export const ButtonText: FC<ButtonTextProps> = ({ 
  title, 
  variant = 'filled', 
  icon = <Plus />, 
  className = '',
  ...props 
}) => {
  const baseStyles = "flex items-center border-1 justify-center bg-surface/70 hover:bg-surface gap-2 px-5 py-3 rounded-full font-body-medium text-base transition-colors duration-200 cursor-pointer active:bg-onSurface active:text-surface active:border-onSurface";
  
  const variantStyles = {
    filled: "text-onSurface border border-transparent",
    outlined: "text-onSurface border border-onSurface"
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
};

export default ButtonText;
