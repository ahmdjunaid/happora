import axios from 'axios'
import { api } from './api'
import type { ServiceFilters, ServiceResponse, ServicesResponse } from '../types/service'

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

export const getServiceById = async (id: string): Promise<ServiceResponse> => {
  try {
    const response = await api.get<ServiceResponse>(`/services/${id}`)

    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service details.')
    }

    throw error
  }
}
