import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { getMyBookings } from '../services/bookingApi'
import type { Booking } from '../types/booking'
import { useAuth } from '../routes/AuthProvider'

export const MyBookingsPage = () => {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getMyBookings()
        setBookings(response.bookings)
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : 'Failed to fetch bookings.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadBookings()
  }, [])

  return (
    <AppShell userName={user?.name} onLogout={logout}>
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            My bookings
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            Your event schedule
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-500">
            Review confirmed bookings, service dates, and the total amount for each
            reservation.
          </p>
        </div>

        {loading && <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Loading bookings...</div>}
        {error && !loading && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Service #{booking.serviceId.slice(0, 8)}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(booking.startDate).toLocaleDateString()} to{' '}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                      {booking.status}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                      {booking.numberOfDays} days
                    </span>
                    <span className="rounded-full bg-brand-soft px-3 py-1 font-medium text-brand">
                      Rs. {booking.totalPrice}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {bookings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                No bookings found yet.
              </div>
            )}
          </div>
        )}
      </section>
    </AppShell>
  )
}
