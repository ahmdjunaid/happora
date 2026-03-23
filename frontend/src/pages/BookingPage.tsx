import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { createBooking } from '../services/bookingApi'
import { getServiceById } from '../services/serviceApi'
import type { Service } from '../types/service'
import { calculateBookingDays } from '../utils/calculateBooking'
import { useAuth } from '../routes/AuthProvider'

export const BookingPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [service, setService] = useState<Service | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadService = async () => {
      try {
        const response = await getServiceById(id)
        setService(response.service)
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : 'Failed to load service.',
        )
      }
    }

    void loadService()
  }, [id])

  const totalDays = calculateBookingDays(startDate, endDate)
  const totalPrice = service ? totalDays * service.pricePerDay : 0

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError('')
      await createBooking({
        serviceId: id,
        startDate,
        endDate,
      })
      navigate('/my-bookings')
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Failed to create booking.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell userName={user?.name} onLogout={logout}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Booking</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            {service?.title || 'Confirm your booking'}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Select your dates and we will calculate the total based on the service’s
            daily rate.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">End date</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
            />
          </label>

          <div className="rounded-2xl bg-brand-soft p-5">
            <p className="text-sm text-slate-500">Total days</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{totalDays}</p>
            <p className="mt-3 text-sm text-slate-500">Total price</p>
            <p className="mt-1 text-2xl font-semibold text-brand">Rs. {totalPrice}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
