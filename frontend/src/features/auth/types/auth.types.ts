export type AuthView = 'login' | 'register' | 'forgot-password'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  name: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  isBlocked: boolean
}

export interface AuthResponse {
  message: string
  user?: AuthUser
  resetToken?: string
  expiresAt?: string
}
