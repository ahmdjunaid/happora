import type { ReactElement } from 'react'
import { useState } from 'react'
import { AuthShell } from '../components/AuthShell'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import type { AuthView } from '../types/auth.types'

export const AuthPage = () => {
  const [activeView, setActiveView] = useState<AuthView>('login')

  const formMap: Record<AuthView, ReactElement> = {
    login: <LoginForm onForgotPassword={() => setActiveView('forgot-password')} />,
    register: <RegisterForm />,
    'forgot-password': <ForgotPasswordForm />,
  }

  return (
    <AuthShell activeView={activeView} onChangeView={setActiveView}>
      {formMap[activeView]}
    </AuthShell>
  )
}
