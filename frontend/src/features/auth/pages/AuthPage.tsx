import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthShell } from '../components/AuthShell'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import type { AuthView } from '../types/auth.types'
import { useAuth } from '../../../routes/AuthProvider'

export const AuthPage = () => {
  const { isAuthenticated, user } = useAuth()
  const [activeView, setActiveView] = useState<AuthView>('login')

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/services' : '/'} replace />
  }

  const formMap: Record<AuthView, ReactElement> = {
    login: <LoginForm />,
    register: <RegisterForm />,
  }

  return (
    <AuthShell activeView={activeView} onChangeView={setActiveView}>
      {formMap[activeView]}
    </AuthShell>
  )
}
