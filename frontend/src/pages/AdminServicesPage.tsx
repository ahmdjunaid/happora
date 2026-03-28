import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { deleteService, getAdminServices } from '../services/serviceApi'
import type { Service } from '../types/service'
import { useAuth } from '../routes/AuthProvider'

const adminLinks = [
  { to: '/admin/services', label: 'Manage Services' },
  { to: '/admin/bookings', label: 'Bookings' },
]

export const AdminServicesPage = () => {
  const { user, logout } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [error, setError] = useState('')

  const loadServices = async () => {
    try {
      setError('')
      const response = await getAdminServices()
      setServices(response.services)
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Failed to load services.',
      )
    }
  }

  useEffect(() => {
    if (!user?.id) {
      return
    }

    void loadServices()
  }, [user?.id])

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id)
      await loadServices()
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Failed to delete service.',
      )
    }
  }

  return (
    <AppShell userName={user?.name} onLogout={logout} links={adminLinks}>
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
              Manage services
            </h1>
          </div>

          <Link
            to="/admin/services/add"
            className="rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white"
          >
            Add Service
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {services.map((service) => (
            <article
              key={service.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{service.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {service.category} • {service.location}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-sm text-slate-600">
                  Rs. {service.pricePerDay}
                </span>
                <Link
                  to={`/admin/services/edit/${service.id}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => void handleDelete(service.id)}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
