import type { ButtonHTMLAttributes, ReactNode, FC } from 'react';
import { Plus } from "flowbite-react-icons/outline";

interface ButtonTextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: 'filled' | 'outlined' | 'active';
  icon?: ReactNode;
}

export const ButtonText: FC<ButtonTextProps> = ({ 
  text, 
  variant = 'filled', 
  icon = <Plus />, 
  className = '',
  ...props 
}) => {
  const baseStyles = "flex items-center border-1 justify-center gap-2 px-5 py-3 rounded-full text-body-medium transition-colors duration-200 cursor-pointer";
  
  const variantStyles = {
    filled: "text-onSurface border border-transparent bg-surface/70 hover:bg-surface",
    outlined: "text-onSurface border border-onSurface bg-surface/70 hover:bg-surface",
    active: "text-surface border border-transparent bg-onSurface",
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default ButtonText;
