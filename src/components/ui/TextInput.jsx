export default function TextInput({ name, value, onChange, placeholder, autocomplete }) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border p-2 w-full"
      autoComplete={autocomplete}
      aria-label={name}
    />
  );
}