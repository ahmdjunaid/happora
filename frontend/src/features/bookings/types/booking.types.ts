export interface BookingItem {
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

export interface CreateBookingPayload {
  serviceId: string
  startDate: string
  endDate: string
}

export interface BookingResponse {
  message: string
  booking: BookingItem
}

export interface BookingsResponse {
  message: string
  bookings: BookingItem[]
}
