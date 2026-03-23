import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { isStrongPassword, isValidEmail } from '../../../shared/lib/validation'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthField } from './AuthField'
import { AuthStatus } from './AuthStatus'
import { useAuth } from '../../../routes/AuthProvider'

export const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
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
      if (!response.token || !response.user) {
        throw new Error('Login response did not include a token.')
      }
      login(response.token, response.user)
      setSuccess(
        response.user
          ? `${response.message} Welcome back, ${response.user.name}.`
          : response.message,
      )
      const redirectTo =
        (location.state as { from?: string } | null)?.from ??
        (response.user.role === 'ADMIN' ? '/admin/services' : '/')
      navigate(redirectTo, { replace: true })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
        <p className="mt-2 text-sm text-slate-500">
          Access your bookings, saved events, and upcoming tickets.
        </p>
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

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          className="rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </div>
    </form>
  )
}
