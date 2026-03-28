import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { passwordRegex, isValidEmail } from '../../../shared/lib/validation'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthField } from './AuthField'
import { AuthStatus } from './AuthStatus'

export const RegisterForm = () => {
  const navigate = useNavigate()
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
    confirmPassword: '',
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()

    if (!formData.name.trim()) {
      setError('Name is required.')
      return
    }

    if (!isValidEmail(formData.email)) {
      setError(formData.email.trim() ? 'Enter a valid email address.' : 'Email is required.')
      return
    }

    if (!formData.password.trim()) {
      setError('Password is required.')
      return
    }

    if (!passwordRegex.test(formData.password)) {
      setError('Password must be 8+ chars with uppercase, lowercase, number, and special character.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Confirm password must match.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await authApi.register(formData)
      setSuccess(`${response.message} Verify the OTP sent to ${response.email}.`)
      navigate(`/verify-otp?email=${encodeURIComponent(response.email)}`, {
        replace: true,
      })
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
        placeholder="Enter a strong password."
        value={formData.password}
        onChange={updateField}
      />
      <AuthField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
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
