import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { ServiceCard } from '../components/ServiceCard'
import { ServiceFilters as FiltersPanel } from '../components/ServiceFilters'
import { useAuth } from '../routes/AuthProvider'
import { getAllServices } from '../services/serviceApi'
import type { Service, ServiceFilters } from '../types/service'
import { getActiveServiceFilters } from '../utils/serviceFilters'

const initialFilters: ServiceFilters = {
  keyword: '',
  category: '',
  location: '',
}

export const HomePage = () => {
  const { user, logout } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [filters, setFilters] = useState<ServiceFilters>(initialFilters)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadServices = async (activeFilters: ServiceFilters) => {
    try {
      setLoading(true)
      setError('')
      const response = await getAllServices(getActiveServiceFilters(activeFilters))
      setServices(response.services)
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Failed to load services.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadServices(initialFilters)
  }, [])

  const handleChange = (name: keyof ServiceFilters, value: string) => {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await loadServices(filters)
  }

  const categories = [...new Set(services.map((service) => service.category))].sort()

  return (
    <AppShell userName={user?.name} onLogout={logout}>
        <header className="mb-8 rounded-[2rem] border border-slate-200/80 bg-white/90 px-6 py-6 shadow-sm backdrop-blur md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                Curated event services
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                Unforgettable event experiences await.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-500">
                Discover trusted vendors and creative professionals for concerts,
                weddings, private dinners, and standout gatherings.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-right">
              <div className="rounded-2xl bg-brand-soft px-5 py-4">
                <p className="text-3xl font-semibold text-brand">{services.length}+</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Services</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-3xl font-semibold text-slate-900">{categories.length}+</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Categories</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <FiltersPanel
              filters={filters}
              categories={categories}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </aside>

          <section>
            {loading && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                Loading services...
              </div>
            )}

            {error && !loading && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600 shadow-sm">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}

            {!loading && !error && services.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500 shadow-sm">
                No services found. Try changing your filters.
              </div>
            )}
          </section>
        </div>
    </AppShell>
  )
}
