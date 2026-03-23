import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { getServiceById } from '../services/serviceApi'
import type { Service } from '../types/service'
import { useAuth } from '../routes/AuthProvider'

export const ServiceDetailsPage = () => {
  const { id = '' } = useParams()
  const { user, logout } = useAuth()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getServiceById(id)
        setService(response.service)
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load service details.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadService()
  }, [id])

  return (
    <AppShell userName={user?.name} onLogout={logout}>
      {loading && <div className="rounded-3xl border bg-white p-6 text-sm text-slate-500 shadow-sm">Loading service details...</div>}
      {error && !loading && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600 shadow-sm">{error}</div>}

      {service && !loading && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              {service.category}
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              {service.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-500">
              {service.description || 'Full service details are available for this booking option.'}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Location</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{service.location}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Category</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{service.category}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Per Day</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Rs. {service.pricePerDay}</p>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Ready to book?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Continue to the booking flow and confirm your preferred dates for this
              service.
            </p>

            <div className="mt-6 rounded-2xl bg-brand-soft p-5">
              <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Starting From</p>
              <p className="mt-2 text-3xl font-semibold text-brand">Rs. {service.pricePerDay}</p>
              <p className="text-sm text-slate-500">Per day rate</p>
            </div>

            <Link
              to={`/services/${service.id}/book`}
              className="mt-6 inline-flex w-full justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white"
            >
              Book Now
            </Link>
          </aside>
        </div>
      )}
    </AppShell>
  )
}
