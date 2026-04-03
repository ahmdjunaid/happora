export interface Service {
  id: string
  title: string
  description?: string
  pricePerDay: number
  location: string
  category: string
  providerId?: string
  totalSlots: number
  availableSlots: number
}

export interface ServicePayload {
  title: string
  description: string
  category: string
  location: string
  pricePerDay: number
  totalSlots: number
}

export interface ServiceFilters {
  keyword: string
  category: string
  location: string
  page?: number
  limit?: number
}

export interface ServicesResponse {
  message: string
  services: Service[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ServiceResponse {
  message: string
  service: Service
}
