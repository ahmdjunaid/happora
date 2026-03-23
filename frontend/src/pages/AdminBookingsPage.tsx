import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { useAuth } from '../routes/AuthProvider'
import { getAdminBookings } from '../services/bookingApi'
import type { AdminBooking } from '../types/booking'

const adminLinks = [
  { to: '/admin/services', label: 'Manage Services' },
  { to: '/admin/bookings', label: 'Bookings' },
]

const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate).toLocaleDateString()
  const end = new Date(endDate).toLocaleDateString()

  return `${start} - ${end}`
}

export const AdminBookingsPage = () => {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true)
        setError('')
        const response = await getAdminBookings()
        setBookings(response.bookings)
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load admin bookings.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadBookings()
  }, [])

  return (
    <AppShell userName={user?.name} onLogout={logout} links={adminLinks}>
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
            Booking overview
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            View every booking made against the services you manage.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
            No bookings found for your services yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Dates</th>
                  <th className="px-4 py-3 font-medium">Total Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{booking.serviceTitle}</p>
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                        {booking.serviceCategory}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{booking.user.name}</p>
                      <p className="text-slate-500">{booking.user.email}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatDateRange(booking.startDate, booking.endDate)}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      Rs. {booking.totalPrice}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  )
}
