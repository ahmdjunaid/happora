import type { ServiceFilters } from '../types/service'

export const getActiveServiceFilters = (
  filters: ServiceFilters,
): Partial<ServiceFilters> => {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) =>
      typeof value === 'string' ? value.trim() !== '' : value !== undefined,
    ),
  ) as Partial<ServiceFilters>
}
