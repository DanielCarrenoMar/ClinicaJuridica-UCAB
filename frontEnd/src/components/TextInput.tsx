import type { ChangeEvent } from 'react';

interface TextInputProps {
  defaultText?: string;
  onChangeText?: (text: string) => void;
  className?: string;
  placeholder?: string;
}

export default function TextInput({ 
  defaultText = '', 
  onChangeText, 
  className = '',
  placeholder = "Lorem ipsum dolor sit amet..."
}: TextInputProps) {
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="text"
        defaultValue={defaultText}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-surface/70 border border-onSurface/40 rounded-3xl px-3 py-2.5 text-body-small text-onSurface placeholder:text-onSurface/40 focus:border-onSurface transition-color"
      />
    </div>
  );
}
