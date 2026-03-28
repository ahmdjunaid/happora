import axios from 'axios'
import { API_BASE_URL } from '../config/env'

const getStoredToken = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem('happora_auth_token') ?? ''
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const initialToken = getStoredToken().trim()

if (initialToken) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${initialToken}`
}

export const setAuthToken = (token: string) => {
  if (token.trim()) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token.trim()}`
    return
  }

  delete apiClient.defaults.headers.common.Authorization
}
