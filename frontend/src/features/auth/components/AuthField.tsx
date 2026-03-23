interface AuthFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (name: any, value: string) => void
}

export const AuthField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
}: AuthFieldProps) => {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </label>
  )
}
