import axios from 'axios'
import { api } from './api'
import type {
  Service,
  ServiceFilters,
  ServiceResponse,
  ServicesResponse,
} from '../types/service'

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

export const createService = async (
  payload: Omit<Service, 'id'>,
): Promise<ServiceResponse> => {
  try {
    const response = await api.post<ServiceResponse>('/services', payload)
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
  payload: Omit<Service, 'id'>,
): Promise<ServiceResponse> => {
  try {
    const response = await api.put<ServiceResponse>(`/services/${id}`, payload)
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
    const response = await api.delete<{ message: string }>(`/services/${id}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete service.')
    }

    throw error
  }
}
