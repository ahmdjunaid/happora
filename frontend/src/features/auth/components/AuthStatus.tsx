interface AuthStatusProps {
  error?: string
  success?: string
}

export const AuthStatus = ({ error, success }: AuthStatusProps) => {
  if (!error && !success) {
    return null
  }

  return (
    <div className={error ? 'auth-status auth-status--error' : 'auth-status auth-status--success'}>
      {error || success}
    </div>
  )
}
