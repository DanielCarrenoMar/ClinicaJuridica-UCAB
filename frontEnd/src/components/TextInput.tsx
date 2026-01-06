import type { ChangeEvent } from 'react';

interface TextInputProps {
  defaultText?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
  disabled?: boolean;
}

export default function TextInput({ 
  defaultText, 
  value,
  onChangeText, 
  className = '',
  placeholder = "Lorem ipsum dolor sit amet...",
  multiline = false,
  type = "text",
  disabled = false,
}: TextInputProps) {
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  const isControlled = value !== undefined;

  return (
    <div className={`w-full ${className}`}>
      {
        multiline ? (
          <textarea
            disabled={disabled}
            value={isControlled ? value : undefined}
            defaultValue={!isControlled ? (defaultText || '') : undefined}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full disabled:opacity-70 bg-surface/70 border border-onSurface/40 rounded-3xl px-3 py-2.5 text-body-small placeholder:text-onSurface/40 resize-y"
            rows={3}
          />
        ) : (
          <input
            type={type}
            disabled={disabled}
            value={isControlled ? value : undefined}
            defaultValue={!isControlled ? (defaultText || '') : undefined}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full disabled:opacity-70 bg-surface/70 border border-onSurface/40 rounded-3xl px-3 py-2.5 text-body-small placeholder:text-onSurface/40"
          />
        )
      }
    </div>
  );
}
