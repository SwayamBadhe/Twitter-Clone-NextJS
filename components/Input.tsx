interface InputProps {
  placeholder?: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  type,
  disabled,
  onChange,
}) => {
  return (
    <input
      disabled={disabled}
      onChange={onChange}
      value={value}
      type={type}
      placeholder={placeholder}
      className="w-full p-4 text-lg bg-black border-2 rounded-md outline-none text-white focus:border-2 transition disabled:bg-neutral-700 disabled:opacity-70 disabled:cursor-not-allowed "
    />
  );
};

export default Input;
