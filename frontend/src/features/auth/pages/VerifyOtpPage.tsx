import type { FormEvent } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { AuthField } from '../components/AuthField'
import { AuthStatus } from '../components/AuthStatus'
import { useAuthForm } from '../hooks/useAuthForm'
import { useAuth } from '../../../routes/AuthProvider'

export const VerifyOtpPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
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
    otp: '',
  })

  if (!email) {
    return <Navigate to="/login" replace />
  }

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()

    if (!/^\d{6}$/.test(formData.otp.trim())) {
      setError('Enter a valid 6 digit OTP.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await authApi.verifyOtp({
        email,
        otp: formData.otp.trim(),
      })

      if (!response.token || !response.user) {
        throw new Error('Verification response did not include a token.')
      }

      login(response.token, response.user)
      setSuccess(response.message)
      navigate(response.user.role === 'ADMIN' ? '/admin/services' : '/', {
        replace: true,
      })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'OTP verification failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    resetMessages()

    try {
      setIsSubmitting(true)
      const response = await authApi.resendOtp(email)
      setSuccess(`${response.message} Check ${response.email}.`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to resend OTP.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-sm backdrop-blur md:p-10">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Happora verification
          </div>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            Verify your email to finish signing up.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
            We sent a 6 digit OTP to <span className="font-medium text-slate-700">{email}</span>.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <form className="space-y-4" onSubmit={handleVerify}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Verify OTP</h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter the verification code sent to your inbox.
              </p>
            </div>

            <AuthStatus error={error} success={success} />

            <AuthField
              label="Email"
              name="email"
              value={email}
              onChange={() => undefined}
              readOnly
            />
            <AuthField
              label="OTP"
              name="otp"
              placeholder="Enter 6 digit OTP"
              value={formData.otp}
              onChange={updateField}
            />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                className="rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700"
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleResend()}
              >
                Resend OTP
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
