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
}

export interface ServicesResponse {
  message: string
  services: Service[]
}

export interface ServiceResponse {
  message: string
  service: Service
}
