export interface ServiceItem {
  id: string
  title: string
  description: string
  category: string
  location: string
  pricePerDay: number
  providerId: string
}

export interface ServiceFilters {
  keyword: string
  category: string
  location: string
  minPrice: string
  maxPrice: string
}

export interface CreateServicePayload {
  title: string
  description: string
  category: string
  location: string
  pricePerDay: number
}

export interface ServicesResponse {
  message: string
  services: ServiceItem[]
}

export interface ServiceResponse {
  message: string
  service: ServiceItem
}
