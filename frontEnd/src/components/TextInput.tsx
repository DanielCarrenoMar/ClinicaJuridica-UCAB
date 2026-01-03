import type { ChangeEvent } from 'react';

interface TextInputProps {
  defaultText?: string;
  onChangeText?: (text: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
}

export default function TextInput({ 
  defaultText = '', 
  onChangeText, 
  className = '',
  placeholder = "Lorem ipsum dolor sit amet...",
  multiline = false,
  type = "text"
}: TextInputProps) {
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {
        multiline ? (
          <textarea
            defaultValue={defaultText}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full bg-surface/70 border border-onSurface/40 rounded-3xl px-3 py-2.5 text-body-small placeholder:text-onSurface/40 resize-y"
            rows={3}
          />
        ) : (
          <input
            type={type}
            defaultValue={defaultText}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full bg-surface/70 border border-onSurface/40 rounded-3xl px-3 py-2.5 text-body-small placeholder:text-onSurface/40"
          />
        )
      }
    </div>
  );
}
