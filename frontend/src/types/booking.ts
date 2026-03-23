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

export interface AdminBooking {
  bookingId: string
  serviceTitle: string
  serviceCategory: string
  user: {
    id: string
    name: string
    email: string
  }
  startDate: string
  endDate: string
  totalPrice: number
  status: string
}

export interface AdminBookingsResponse {
  message: string
  bookings: AdminBooking[]
}
