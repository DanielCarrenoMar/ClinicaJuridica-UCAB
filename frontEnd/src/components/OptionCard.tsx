import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CheckCircle } from "flowbite-react-icons/outline";

interface OptionCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string;
  icon: ReactNode;
  selected?: boolean;
}

export default function OptionCard({
  title,
  description,
  icon,
  selected = false,
  className = "",
  ...props
}: OptionCardProps) {
  return (
    <button
      className={`
        relative flex bg-surface/70 hover:bg-surface w-full cursor-pointer items-start gap-5 overflow-hidden rounded-3xl border-2 px-4 py-2.5 text-left transition-all duration-200
        ${
          selected
            ? "border-success "
            : "border-transparent"
        }
        ${className}
      `}
      {...props}
    >
      <div className="flex grow basis-0 flex-col items-start gap-1">
        <div className="flex w-full items-center gap-1.5">
          <div className="text-success [&>svg]:size-6">
            {icon}
          </div>
          <p className="text-nowrap text-body-large whitespace-nowrap font-medium text-onSurface">
            {title}
          </p>
        </div>
        <p className="w-full text-body-small font-light text-onSurface/70">
          {description}
        </p>
      </div>
      
      {selected && (
        <div className="shrink-0 text-success [&>svg]:size-6">
          <CheckCircle />
        </div>
      )}
    </button>
  );
}
