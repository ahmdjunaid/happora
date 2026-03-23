import axios from 'axios'
import { API_BASE_URL } from '../config/env'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token: string) => {
  if (token.trim()) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token.trim()}`
    return
  }

  delete apiClient.defaults.headers.common.Authorization
}
