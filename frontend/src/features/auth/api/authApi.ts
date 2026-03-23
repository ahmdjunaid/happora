import axios from 'axios'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../types/auth.types'
import { apiClient } from '../../../shared/lib/api'

// reusable error handler (same as bookings)
const handleError = (error: unknown): never => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    throw new Error(error.response?.data?.message || 'Request failed')
  }

  throw error
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', payload)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', payload)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },
}
