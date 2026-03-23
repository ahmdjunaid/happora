import { useEffect, useState } from 'react'
import { bookingsApi } from '../../bookings/api/bookingsApi'
import type { BookingItem } from '../../bookings/types/booking.types'
import { servicesApi } from '../../services/api/servicesApi'
import type {
  CreateServicePayload,
  ServiceFilters,
  ServiceItem,
} from '../../services/types/service.types'
import { setAuthToken } from '../../../shared/lib/api'

const initialFilters: ServiceFilters = {
  keyword: '',
  category: '',
  location: '',
  minPrice: '',
  maxPrice: '',
}

const initialServiceForm = {
  title: '',
  description: '',
  category: '',
  location: '',
  pricePerDay: '',
}

const initialBookingForm = {
  startDate: '',
  endDate: '',
}

export const EventPlatformPage = () => {
  const [token, setToken] = useState(() => localStorage.getItem('happora_token') ?? '')
  const [role, setRole] = useState(() => localStorage.getItem('happora_role') ?? 'user')
  const [services, setServices] = useState<ServiceItem[]>([])
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [filters, setFilters] = useState<ServiceFilters>(initialFilters)
  const [serviceForm, setServiceForm] = useState(initialServiceForm)
  const [bookingForm, setBookingForm] = useState(initialBookingForm)
  const [servicesMessage, setServicesMessage] = useState('')
  const [bookingMessage, setBookingMessage] = useState('')
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [isCreatingService, setIsCreatingService] = useState(false)
  const [isCreatingBooking, setIsCreatingBooking] = useState(false)
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)

  useEffect(() => {
    setAuthToken(token)
    if (token) {
      localStorage.setItem('happora_token', token)
    } else {
      localStorage.removeItem('happora_token')
    }
  }, [token])

  useEffect(() => {
    localStorage.setItem('happora_role', role)
  }, [role])

  useEffect(() => {
    void loadServices()
  }, [])

  const loadServices = async (activeFilters: Partial<ServiceFilters> = filters) => {
    try {
      setIsLoadingServices(true)
      setServicesMessage('')
      const response = await servicesApi.getAll(activeFilters)
      setServices(response.services)
      if (response.services.length && !selectedService) {
        setSelectedService(response.services[0])
      }
    } catch (error) {
      setServicesMessage(error instanceof Error ? error.message : 'Unable to load services.')
    } finally {
      setIsLoadingServices(false)
    }
  }

  const loadBookings = async () => {
    try {
      setIsLoadingBookings(true)
      setBookingMessage('')
      const response = await bookingsApi.getMine()
      setBookings(response.bookings)
      setBookingMessage(response.message)
    } catch (error) {
      setBookingMessage(error instanceof Error ? error.message : 'Unable to load bookings.')
    } finally {
      setIsLoadingBookings(false)
    }
  }

  const handleFilterChange = (name: keyof ServiceFilters, value: string) => {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const handleServiceFormChange = (name: keyof typeof initialServiceForm, value: string) => {
    setServiceForm((current) => ({ ...current, [name]: value }))
  }

  const handleBookingFormChange = (name: keyof typeof initialBookingForm, value: string) => {
    setBookingForm((current) => ({ ...current, [name]: value }))
  }

  const handleApplyFilters = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await loadServices(filters)
  }

  const handleCreateService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsCreatingService(true)
      setServicesMessage('')
      const payload: CreateServicePayload = {
        title: serviceForm.title.trim(),
        description: serviceForm.description.trim(),
        category: serviceForm.category.trim(),
        location: serviceForm.location.trim(),
        pricePerDay: Number(serviceForm.pricePerDay),
      }
      const response = await servicesApi.create(payload)
      setServicesMessage(response.message)
      setServiceForm(initialServiceForm)
      await loadServices()
    } catch (error) {
      setServicesMessage(error instanceof Error ? error.message : 'Unable to create service.')
    } finally {
      setIsCreatingService(false)
    }
  }

  const handleCreateBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedService) {
      setBookingMessage('Select a service before booking.')
      return
    }

    try {
      setIsCreatingBooking(true)
      setBookingMessage('')
      const response = await bookingsApi.create({
        serviceId: selectedService.id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
      })
      setBookingMessage(response.message)
      setBookingForm(initialBookingForm)
      await loadBookings()
    } catch (error) {
      setBookingMessage(error instanceof Error ? error.message : 'Unable to create booking.')
    } finally {
      setIsCreatingBooking(false)
    }
  }

  return (
    <main className="platform-page">
      <section className="platform-hero">
        <div className="platform-badge">Happora event booking</div>
        <h1>Manage services and bookings from one clean workspace.</h1>
        <p>
          Browse available event services, publish provider offerings, and create bookings
          against the live backend modules you just added.
        </p>
      </section>

      <section className="platform-grid">
        <aside className="platform-sidebar">
          <div className="panel">
            <div className="panel__header">
              <h2>Session</h2>
              <p>Use a valid JWT so protected service and booking actions succeed.</p>
            </div>

            <label className="field">
              <span>Bearer token</span>
              <textarea
                rows={4}
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Paste JWT token here"
              />
            </label>

            <label className="field">
              <span>Current role</span>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="user">User</option>
                <option value="provider">Provider</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>

          <div className="panel">
            <div className="panel__header">
              <h2>Filter services</h2>
              <p>Search by keyword, category, location, or price range.</p>
            </div>

            <form className="stack" onSubmit={handleApplyFilters}>
              <label className="field">
                <span>Keyword</span>
                <input
                  value={filters.keyword}
                  onChange={(event) => handleFilterChange('keyword', event.target.value)}
                  placeholder="Photography, decor..."
                />
              </label>
              <label className="field">
                <span>Category</span>
                <input
                  value={filters.category}
                  onChange={(event) => handleFilterChange('category', event.target.value)}
                  placeholder="Photography"
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input
                  value={filters.location}
                  onChange={(event) => handleFilterChange('location', event.target.value)}
                  placeholder="Kochi"
                />
              </label>

              <div className="field-row">
                <label className="field">
                  <span>Min price</span>
                  <input
                    value={filters.minPrice}
                    onChange={(event) => handleFilterChange('minPrice', event.target.value)}
                    placeholder="5000"
                  />
                </label>
                <label className="field">
                  <span>Max price</span>
                  <input
                    value={filters.maxPrice}
                    onChange={(event) => handleFilterChange('maxPrice', event.target.value)}
                    placeholder="20000"
                  />
                </label>
              </div>

              <button className="primary-button" type="submit" disabled={isLoadingServices}>
                {isLoadingServices ? 'Loading...' : 'Apply filters'}
              </button>
            </form>
          </div>

          {(role === 'provider' || role === 'admin') && (
            <div className="panel">
              <div className="panel__header">
                <h2>Create service</h2>
                <p>Provider and admin roles can publish new event services.</p>
              </div>

              <form className="stack" onSubmit={handleCreateService}>
                <label className="field">
                  <span>Title</span>
                  <input
                    value={serviceForm.title}
                    onChange={(event) => handleServiceFormChange('title', event.target.value)}
                    placeholder="Wedding photography"
                  />
                </label>
                <label className="field">
                  <span>Description</span>
                  <textarea
                    rows={3}
                    value={serviceForm.description}
                    onChange={(event) =>
                      handleServiceFormChange('description', event.target.value)
                    }
                    placeholder="Full-day event coverage"
                  />
                </label>
                <label className="field">
                  <span>Category</span>
                  <input
                    value={serviceForm.category}
                    onChange={(event) => handleServiceFormChange('category', event.target.value)}
                    placeholder="Photography"
                  />
                </label>
                <label className="field">
                  <span>Location</span>
                  <input
                    value={serviceForm.location}
                    onChange={(event) => handleServiceFormChange('location', event.target.value)}
                    placeholder="Kochi"
                  />
                </label>
                <label className="field">
                  <span>Price per day</span>
                  <input
                    value={serviceForm.pricePerDay}
                    onChange={(event) =>
                      handleServiceFormChange('pricePerDay', event.target.value)
                    }
                    placeholder="15000"
                  />
                </label>

                <button className="primary-button" type="submit" disabled={isCreatingService}>
                  {isCreatingService ? 'Publishing...' : 'Create service'}
                </button>
              </form>
            </div>
          )}
        </aside>

        <section className="platform-main">
          <div className="panel panel--wide">
            <div className="panel__header">
              <h2>Available services</h2>
              <p>{servicesMessage || 'Browse live services and pick one to book.'}</p>
            </div>

            <div className="service-list">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={
                    selectedService?.id === service.id
                      ? 'service-card service-card--active'
                      : 'service-card'
                  }
                  onClick={() => setSelectedService(service)}
                >
                  <div className="service-card__header">
                    <h3>{service.title}</h3>
                    <span>Rs. {service.pricePerDay.toLocaleString()} / day</span>
                  </div>
                  <p>{service.description}</p>
                  <div className="service-card__meta">
                    <span>{service.category}</span>
                    <span>{service.location}</span>
                  </div>
                </button>
              ))}

              {!services.length && !isLoadingServices && (
                <div className="empty-state">No services found for the selected filters.</div>
              )}
            </div>
          </div>

          <div className="platform-main__grid">
            <div className="panel">
              <div className="panel__header">
                <h2>Book selected service</h2>
                <p>
                  {selectedService
                    ? `Booking ${selectedService.title} in ${selectedService.location}.`
                    : 'Choose a service card to begin booking.'}
                </p>
              </div>

              <form className="stack" onSubmit={handleCreateBooking}>
                <label className="field">
                  <span>Selected service</span>
                  <input value={selectedService?.title ?? ''} readOnly placeholder="Select a service" />
                </label>
                <div className="field-row">
                  <label className="field">
                    <span>Start date</span>
                    <input
                      type="date"
                      value={bookingForm.startDate}
                      onChange={(event) =>
                        handleBookingFormChange('startDate', event.target.value)
                      }
                    />
                  </label>
                  <label className="field">
                    <span>End date</span>
                    <input
                      type="date"
                      value={bookingForm.endDate}
                      onChange={(event) => handleBookingFormChange('endDate', event.target.value)}
                    />
                  </label>
                </div>

                <button className="primary-button" type="submit" disabled={isCreatingBooking}>
                  {isCreatingBooking ? 'Booking...' : 'Book service'}
                </button>
              </form>

              {bookingMessage && <div className="notice">{bookingMessage}</div>}
            </div>

            <div className="panel">
              <div className="panel__header">
                <h2>My bookings</h2>
                <p>Load bookings for the authenticated user from the backend.</p>
              </div>

              <button
                className="secondary-button"
                type="button"
                onClick={() => void loadBookings()}
                disabled={isLoadingBookings}
              >
                {isLoadingBookings ? 'Loading bookings...' : 'Refresh my bookings'}
              </button>

              <div className="booking-list">
                {bookings.map((booking) => (
                  <article key={booking.id} className="booking-card">
                    <div className="booking-card__header">
                      <strong>{booking.status}</strong>
                      <span>Rs. {booking.totalPrice.toLocaleString()}</span>
                    </div>
                    <p>{booking.numberOfDays} day booking</p>
                    <div className="booking-card__meta">
                      <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                      <span>{new Date(booking.endDate).toLocaleDateString()}</span>
                    </div>
                  </article>
                ))}

                {!bookings.length && <div className="empty-state">No bookings loaded yet.</div>}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
