export type AuthView = 'login' | 'register'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  name: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'PROVIDER' | 'ADMIN'
  isBlocked: boolean
}

export interface AuthResponse {
  message: string
  user?: AuthUser
  token?: string
}
