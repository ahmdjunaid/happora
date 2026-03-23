import type { FormEvent } from 'react'
import { authApi } from '../api/authApi'
import { isStrongPassword, isValidEmail } from '../../../shared/lib/validation'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthField } from './AuthField'
import { AuthStatus } from './AuthStatus'

interface LoginFormProps {
  onForgotPassword: () => void
}

export const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const {
    formData,
    updateField,
    error,
    setError,
    success,
    setSuccess,
    isSubmitting,
    setIsSubmitting,
    resetMessages,
  } = useAuthForm({
    email: '',
    password: '',
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()

    if (!isValidEmail(formData.email)) {
      setError('Enter a valid email address.')
      return
    }

    if (!isStrongPassword(formData.password)) {
      setError('Password must be at least 8 characters long.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await authApi.login(formData)
      setSuccess(
        response.user
          ? `${response.message} Welcome back, ${response.user.name}.`
          : response.message,
      )
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-copy">
        <h2>Login</h2>
        <p>Access your bookings, saved events, and upcoming tickets.</p>
      </div>

      <AuthStatus error={error} success={success} />

      <AuthField
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={updateField}
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        placeholder="Minimum 8 characters"
        value={formData.password}
        onChange={updateField}
      />

      <div className="auth-actions">
        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
        <button
          className="auth-link-button"
          type="button"
          onClick={onForgotPassword}
          disabled={isSubmitting}
        >
          Forgot password?
        </button>
      </div>
    </form>
  )
}
