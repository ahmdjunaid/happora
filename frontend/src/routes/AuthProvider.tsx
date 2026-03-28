import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { setAuthToken } from '../shared/lib/api'
import type { AuthUser } from '../features/auth/types/auth.types'
import { authStorage } from '../utils/authStorage'

interface AuthContextValue {
  user: AuthUser | null
  token: string
  isAuthenticated: boolean
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState(() => authStorage.getToken())
  const [user, setUser] = useState<AuthUser | null>(() => authStorage.getUser())

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login: (nextToken, nextUser) => {
        setToken(nextToken)
        setUser(nextUser)
        authStorage.setToken(nextToken)
        authStorage.setUser(nextUser)
      },
      logout: () => {
        setToken('')
        setUser(null)
        authStorage.clearToken()
        authStorage.clearUser()
        setAuthToken('')
      },
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
