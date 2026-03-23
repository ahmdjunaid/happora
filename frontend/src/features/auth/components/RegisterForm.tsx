import type { FormEvent } from 'react'
import { authApi } from '../api/authApi'
import { isStrongPassword, isValidEmail } from '../../../shared/lib/validation'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthField } from './AuthField'
import { AuthStatus } from './AuthStatus'

export const RegisterForm = () => {
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
      setSuccess(
        response.user
          ? `${response.message} Account created for ${response.user.email}.`
          : response.message,
      )
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-copy">
        <h2>Create account</h2>
        <p>Create your guest account to reserve seats and manage upcoming bookings.</p>
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

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Register'}
      </button>
    </form>
  )
}
