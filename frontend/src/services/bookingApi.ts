import axios from 'axios'
import { api } from './api'
import type { BookingsResponse } from '../types/booking'

export const getMyBookings = async (): Promise<BookingsResponse> => {
  try {
    const response = await api.get<BookingsResponse>('/bookings/my-bookings')
    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings.')
    }

    throw error
  }
}
