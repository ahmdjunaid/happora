import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { isStrongPassword, isValidEmail } from '../../../shared/lib/validation'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthField } from './AuthField'
import { AuthStatus } from './AuthStatus'
import { useAuth } from '../../../routes/AuthProvider'

export const RegisterForm = () => {
  const navigate = useNavigate()
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
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()

    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long.')
      return
    }

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
      const response = await authApi.register(formData)
      if (!response.token || !response.user) {
        throw new Error('Registration response did not include a token.')
      }
      login(response.token, response.user)
      setSuccess(
        response.user
          ? `${response.message} Account created for ${response.user.email}.`
          : response.message,
      )
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
        <p className="mt-2 text-sm text-slate-500">
          Create your guest account to reserve seats and manage upcoming bookings.
        </p>
      </div>

      <AuthStatus error={error} success={success} />

      <AuthField
        label="Full name"
        name="name"
        placeholder="Ava Johnson"
        value={formData.name}
        onChange={updateField}
      />
      <AuthField
        label="Email"
        name="email"
        type="email"
        placeholder="ava@example.com"
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

      <button
        className="rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating account...' : 'Register'}
      </button>
    </form>
  )
}
