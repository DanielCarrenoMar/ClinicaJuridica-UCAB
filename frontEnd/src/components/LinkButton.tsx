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
  
  const isDownload = !!props.download;
  const Component = isDownload ? 'a' : Link;
  const linkProps = isDownload ? { href: props.to as string, ...props } : props;

  return (
    <Component
      className={`${!children && 'w-fit'} ${baseButtonStyles} ${variantButtonStyles[variant]} ${className}`}
      {...linkProps}
    >
      <span className="group-hover:animate-pulsing group-hover:animate-duration-400">
        {icon}
      </span>
      {children}
    </Component>
  );
};

export default LinkButton;