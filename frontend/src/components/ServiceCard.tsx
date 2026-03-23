import { Link } from 'react-router-dom'
import type { Service } from '../types/service'

interface ServiceCardProps {
  service: Service
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const isFullyBooked = service.availableSlots === 0
  const isLowAvailability = service.availableSlots > 0 && service.availableSlots <= 3

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            {service.category}
          </span>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">{service.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Per Day</p>
          <p className="text-lg font-semibold text-slate-900">Rs. {service.pricePerDay}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-500">
        <p className="line-clamp-2 min-h-10">{service.description || 'Event service available for booking.'}</p>
        <p className="font-medium text-slate-600">{service.location}</p>
        <p className="font-medium text-slate-700">Available Slots: {service.availableSlots}</p>
        {isFullyBooked && <p className="font-medium text-rose-600">Fully Booked</p>}
        {isLowAvailability && <p className="font-medium text-amber-600">Hurry! Only few slots left</p>}
      </div>

      <Link
        to={`/services/${service.id}`}
        className="mt-5 inline-flex rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white"
      >
        View Service
      </Link>
    </article>
  )
}
