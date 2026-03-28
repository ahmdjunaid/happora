import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAuth } from '../routes/AuthProvider'
import {
  checkBookingAvailability,
  createBooking,
} from '../services/bookingApi'
import { getServiceById } from '../services/serviceApi'
import type { BookingAvailabilityResponse } from '../types/booking'
import type { Service } from '../types/service'
import { calculateBookingDays } from '../utils/calculateBooking'
import { getTodayDateValue } from '../utils/dateFormatter'

export const BookingPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [service, setService] = useState<Service | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [availability, setAvailability] = useState<BookingAvailabilityResponse | null>(null)
  const [availabilityError, setAvailabilityError] = useState('')
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const minimumStartDate = getTodayDateValue()

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

  useEffect(() => {
    if (!id || !startDate || !endDate) {
      setAvailability(null)
      setAvailabilityError('')
      return
    }

    const loadAvailability = async () => {
      try {
        setIsCheckingAvailability(true)
        setAvailabilityError('')
        const response = await checkBookingAvailability({
          serviceId: id,
          startDate,
          endDate,
        })
        setAvailability(response)
      } catch (requestError) {
        setAvailability(null)
        setAvailabilityError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to check availability.',
        )
      } finally {
        setIsCheckingAvailability(false)
      }
    }

    void loadAvailability()
  }, [endDate, id, startDate])

  const totalDays = calculateBookingDays(startDate, endDate)
  const totalPrice = service ? totalDays * service.pricePerDay : 0
  const availableSlots = availability?.availableSlots ?? service?.availableSlots ?? 0
  const isFullyBooked =
    Boolean(startDate && endDate) && availability ? !availability.available : false
  const isLowAvailability = availableSlots > 0 && availableSlots <= 2

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!service || isFullyBooked || (availability && !availability.available)) {
      return
    }

    if (startDate < minimumStartDate) {
      setError('Cannot book for past dates.')
      return
    }

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
            Select your dates and we will calculate the total based on the service's
            daily rate.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Daily Capacity</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {service?.totalSlots ?? 0}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Select dates to check real-time availability for this service.
            </p>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          {availabilityError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {availabilityError}
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Start date</span>
            <input
              type="date"
              value={startDate}
              min={minimumStartDate}
              onChange={(event) => {
                setStartDate(event.target.value)
                if (endDate && event.target.value > endDate) {
                  setEndDate('')
                }
              }}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">End date</span>
            <input
              type="date"
              value={endDate}
              min={startDate || minimumStartDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
            />
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Availability Status</p>
            {!startDate || !endDate ? (
              <p className="mt-2 text-sm font-medium text-slate-600">
                Select dates to check availability.
              </p>
            ) : isCheckingAvailability ? (
              <p className="mt-2 text-sm font-medium text-slate-600">Checking availability...</p>
            ) : availability?.available ? (
              <>
                <p className="mt-2 text-sm font-medium text-emerald-600">Available</p>
                <p className="mt-1 text-sm text-slate-600">
                  Slots left for selected dates: {availableSlots}
                </p>
                {isLowAvailability && (
                  <p className="mt-2 text-sm font-medium text-amber-600">
                    Hurry! Few slots left
                  </p>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm font-medium text-rose-600">Fully Booked</p>
            )}
          </div>

          <div className="rounded-2xl bg-brand-soft p-5">
            <p className="text-sm text-slate-500">Total days</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{totalDays}</p>
            <p className="mt-3 text-sm text-slate-500">Total price</p>
            <p className="mt-1 text-2xl font-semibold text-brand">Rs. {totalPrice}</p>
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting ||
              isCheckingAvailability ||
              !startDate ||
              !endDate ||
              isFullyBooked
            }
            className="rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting
              ? 'Confirming...'
              : isCheckingAvailability
                ? 'Checking...'
                : isFullyBooked
                  ? 'Fully Booked'
                  : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
