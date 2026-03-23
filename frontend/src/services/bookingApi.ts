import axios from 'axios'
import type { Booking, BookingsResponse } from '../types/booking'
import { apiClient } from '../shared/lib/api'

export interface CreateBookingPayload {
  serviceId: string
  startDate: string
  endDate: string
}

export interface BookingResponse {
  message: string
  booking: Booking
}

export const getMyBookings = async (): Promise<BookingsResponse> => {
  try {
    const response = await apiClient.get<BookingsResponse>('/bookings/my-bookings')
    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings.')
    }

    throw error
  }
}

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<BookingResponse> => {
  try {
    const response = await apiClient.post<BookingResponse>('/bookings', payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create booking.')
    }

    throw error
  }
}
