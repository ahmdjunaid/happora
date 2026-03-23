interface AuthStatusProps {
  error?: string
  success?: string
}

export const AuthStatus = ({ error, success }: AuthStatusProps) => {
  if (!error && !success) {
    return null
  }

  return (
    <div
      className={
        error
          ? 'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600'
          : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'
      }
    >
      {error || success}
    </div>
  )
}
