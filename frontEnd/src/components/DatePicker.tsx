import type { ChangeEvent } from 'react';

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  className?: string;
  name?: string;
  id?: string;
  required?: boolean;
  min?: string;
  disabled?: boolean;
}

export default function DatePicker({
  label,
  value,
  onChange,
  className = '',
  name,
  id,
  required = false,
  min,
  disabled = false
}: DatePickerProps) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`flex flex-col gap-2 items-start ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className={`flex items-center px-1.5 w-full text-body-large ${className} ${disabled ? 'opacity-70' : ''}`}
        >
          {label}
        </label>
      )}
      <input
        type="date"
        id={id || name}
        name={name}
        value={value || ''}
        onChange={handleChange}
        required={required}
        min={min}
        disabled={disabled}
        className={`w-full bg-surface/70 border border-onSurface/40 rounded-3xl px-3 py-2.5 text-body-small placeholder:text-onSurface/40 text-onSurface ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}
