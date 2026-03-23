import axios from 'axios'
import { api } from './api'
import type { ServiceFilters, ServicesResponse } from '../types/service'

export const getAllServices = async (
  filters: Partial<ServiceFilters>,
): Promise<ServicesResponse> => {
  try {
    const response = await api.get<ServicesResponse>('/services', {
      params: filters,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch services.')
    }

    throw error
  }
}
