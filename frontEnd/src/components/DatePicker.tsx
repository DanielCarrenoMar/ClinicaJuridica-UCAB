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
}

export default function DatePicker({
  label,
  value,
  onChange,
  className = '',
  name,
  id,
  required = false,
  min
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
          className="flex items-center px-1.5 w-full text-body-large text-onSurface"
        >
          {label}
        </label>
      )}
      <input
        type="date"
        id={id || name}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
        min={min}
        className="w-full bg-surface/70 border border-onSurface/40 rounded-3xl px-3 py-2.5 text-body-small placeholder:text-onSurface/40 text-onSurface"
      />
    </div>
  );
}
