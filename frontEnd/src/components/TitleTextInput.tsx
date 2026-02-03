import TextInput from './TextInput';
import { useState } from 'react';
import { Eye, EyeSlash } from 'flowbite-react-icons/outline';

interface TitleTextInputProps {
  label: string;
  value?: string;
  onChange?: (text: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  multiline?: boolean;
  rows?: number;
  resize?: boolean;
}

export default function TitleTextInput({
  label,
  value,
  onChange,
  className = '',
  placeholder = "",
  disabled = false,
  type = "text",
  multiline = false,
  rows = 3,
  resize = false
}: TitleTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-2 items-start`}>
      <label htmlFor={label} className={`flex text-body-large *:items-center px-1.5 w-full ${className} ${disabled ? 'opacity-70' : ''}`}>
          {label}
      </label>
      <TextInput
        id={label}
        defaultText={value}
        onChangeText={onChange}
        placeholder={placeholder}
        className="w-full"
        disabled={disabled}
        type={inputType}
        multiline={multiline}
        rows={rows}
        resize={resize}
        rightIcon={isPassword ? (showPassword ? <EyeSlash className="size-5" /> : <Eye className="size-5" />) : undefined}
        onRightIconClick={isPassword ? () => setShowPassword(!showPassword) : undefined}
      />
    </div>
  );
}
