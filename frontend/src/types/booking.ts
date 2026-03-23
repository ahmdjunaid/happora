export interface Booking {
  id: string
  serviceId: string
  userId: string
  providerId: string
  startDate: string
  endDate: string
  numberOfDays: number
  totalPrice: number
  status: string
}

export interface BookingsResponse {
  message: string
  bookings: Booking[]
}

export interface BookingAvailabilityResponse {
  message: string
  available: boolean
  availableSlots: number
}
