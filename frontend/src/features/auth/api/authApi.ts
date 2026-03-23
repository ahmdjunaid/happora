import axios from 'axios'
import { API_BASE_URL } from '../../../shared/config/env'
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
} from '../types/auth.types'

const authClient = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
})

const request = async <TResponse, TPayload>(
  endpoint: string,
  payload: TPayload,
): Promise<TResponse> => {
  try {
    const response = await authClient.post<TResponse>(`/${endpoint}`, payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError<AuthResponse>(error)) {
      throw new Error(error.response?.data?.message || 'Request failed')
    }

    throw error
  }
}

export const authApi = {
  login: (payload: LoginPayload) => request<AuthResponse, LoginPayload>('login', payload),
  register: (payload: RegisterPayload) =>
    request<AuthResponse, RegisterPayload>('register', payload),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    request<AuthResponse, ForgotPasswordPayload>('forgot-password', payload),
}
