import TextInput from './TextInput';

interface TitleTextInputProps {
  label: string;
  value?: string;
  onChange?: (text: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function TitleTextInput({
  label,
  value,
  onChange,
  className = '',
  placeholder = "",
  disabled = false
}: TitleTextInputProps) {
  return (
    <div className={`flex flex-col gap-2 items-start`}>
      <div className={`flex items-center px-1.5 w-full ${className} ${disabled ? 'opacity-70' : ''}`}>
        <p className="text-body-large text-onSurface">
          {label}
        </p>
      </div>
      <TextInput
        defaultText={value}
        onChangeText={onChange}
        placeholder={placeholder}
        className="w-full"
        disabled={disabled}
      />
    </div>
  );
}
