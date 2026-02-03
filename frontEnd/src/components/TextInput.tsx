import type { ChangeEvent, ReactNode } from 'react';

interface TextInputProps {
  id?: string;
  defaultText?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  resize?: boolean;
  type?: string;
  disabled?: boolean;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export default function TextInput({
  id = undefined,
  defaultText,
  value,
  onChangeText,
  className = '',
  placeholder = "Lorem ipsum dolor sit amet...",
  multiline = false,
  rows = 3,
  resize = false,
  type = "text",
  disabled = false,
  rightIcon,
  onRightIconClick
}: TextInputProps) {

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  const isControlled = value !== undefined;

  return (
    <div className={`w-full relative ${className}`}>
      {
        multiline ? (
          <textarea
            id={id}
            disabled={disabled}
            value={isControlled ? value : undefined}
            defaultValue={!isControlled ? (defaultText || '') : undefined}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full disabled:opacity-70 bg-surface/70 border border-onSurface/40 rounded-3xl px-3 py-2.5 text-body-small placeholder:text-onSurface/40 ${resize ? 'resize-y' : 'resize-none'}`}
            rows={rows}
          />
        ) : (
          <input
          id={id}
            type={type}
            disabled={disabled}
            value={isControlled ? value : undefined}
            defaultValue={!isControlled ? (defaultText || '') : undefined}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full disabled:opacity-70 bg-surface/70 border border-onSurface/40 rounded-3xl px-3 py-2.5 text-body-small placeholder:text-onSurface/40 ${rightIcon ? 'pr-10' : ''}`}
          />
        )
      }
      {rightIcon && !multiline && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-onSurface/60 hover:text-onSurface"
          disabled={disabled}
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
}
