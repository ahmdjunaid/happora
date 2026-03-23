import axios from 'axios'
import type {
  ServiceFilters,
  ServicePayload,
  ServiceResponse,
  ServicesResponse,
} from '../types/service'
import { apiClient } from '../shared/lib/api'

export const getAllServices = async (
  filters: Partial<ServiceFilters>,
): Promise<ServicesResponse> => {
  try {
    const response = await apiClient.get<ServicesResponse>('/services', {
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
    const response = await apiClient.get<ServiceResponse>(`/services/${id}`)

    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service details.')
    }

    throw error
  }
}

export const createService = async (
  payload: ServicePayload,
): Promise<ServiceResponse> => {
  try {
    const response = await apiClient.post<ServiceResponse>('/services', payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create service.')
    }

    throw error
  }
}

export const updateService = async (
  id: string,
  payload: ServicePayload,
): Promise<ServiceResponse> => {
  try {
    const response = await apiClient.put<ServiceResponse>(`/services/${id}`, payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update service.')
    }

    throw error
  }
}

export const deleteService = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>(`/services/${id}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete service.')
    }

    throw error
  }
}
