import type { ServiceFilters } from '../types/service'

export const getActiveServiceFilters = (
  filters: ServiceFilters,
): Partial<ServiceFilters> => {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value.trim() !== ''),
  ) as Partial<ServiceFilters>
}
