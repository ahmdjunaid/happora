export interface Service {
  id: string
  title: string
  description?: string
  pricePerDay: number
  location: string
  category: string
  providerId?: string
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
