import type { FormEvent } from 'react'
import { authApi } from '../api/authApi'
import { isValidEmail } from '../../../shared/lib/validation'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthField } from './AuthField'
import { AuthStatus } from './AuthStatus'

export const ForgotPasswordForm = () => {
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
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()

    if (!isValidEmail(formData.email)) {
      setError('Enter a valid email address.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await authApi.forgotPassword(formData)
      const expiryText = response.expiresAt
        ? ` Token expires at ${new Date(response.expiresAt).toLocaleString()}.`
        : ''
      const tokenText = response.resetToken ? ` Reset token: ${response.resetToken}` : ''

      setSuccess(`${response.message}${expiryText}${tokenText}`)
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to process request.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-copy">
        <h2>Forgot password</h2>
        <p>Enter your booking email and request quick recovery help.</p>
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

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Generating token...' : 'Request assistance'}
      </button>
    </form>
  )
}
