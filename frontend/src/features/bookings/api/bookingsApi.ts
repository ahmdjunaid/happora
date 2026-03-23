import axios from 'axios'
import { apiClient } from '../../../shared/lib/api'
import type {
  BookingResponse,
  BookingsResponse,
  CreateBookingPayload,
} from '../types/booking.types'

const handleError = (error: unknown): never => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    throw new Error(error.response?.data?.message || 'Request failed')
  }

  throw error
}

export const bookingsApi = {
  async create(payload: CreateBookingPayload): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<BookingResponse>('/bookings', payload)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  async getMine(): Promise<BookingsResponse> {
    try {
      const response = await apiClient.get<BookingsResponse>('/bookings/my-bookings')
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },
}
