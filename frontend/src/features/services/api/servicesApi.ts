import axios from 'axios'
import { apiClient } from '../../../shared/lib/api'
import type {
  CreateServicePayload,
  ServiceFilters,
  ServiceResponse,
  ServicesResponse,
} from '../types/service.types'

const handleError = (error: unknown): never => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    throw new Error(error.response?.data?.message || 'Request failed')
  }

  throw error
}

export const servicesApi = {
  async getAll(filters: Partial<ServiceFilters>): Promise<ServicesResponse> {
    try {
      const response = await apiClient.get<ServicesResponse>('/services', {
        params: filters,
      })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  async create(payload: CreateServicePayload): Promise<ServiceResponse> {
    try {
      const response = await apiClient.post<ServiceResponse>('/services', payload)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },
}
