interface AuthFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (name: string, value: string) => void
  readOnly?: boolean
}

export const AuthField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  readOnly = false,
}: AuthFieldProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
      />
    </label>
  )
}
