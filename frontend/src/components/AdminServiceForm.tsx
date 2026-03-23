import type { FormEvent } from 'react'
import type { Service } from '../types/service'
import { categories } from '../utils/categories'

export interface AdminServiceFormValues {
  title: string
  category: string
  pricePerDay: string
  location: string
  description: string
}

interface AdminServiceFormProps {
  title: string
  description: string
  values: AdminServiceFormValues
  submitLabel: string
  isSubmitting: boolean
  error: string
  onChange: (name: keyof AdminServiceFormValues, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export const getServicePayloadFromForm = (
  values: AdminServiceFormValues,
): Omit<Service, 'id'> => ({
  title: values.title.trim(),
  category: values.category,
  pricePerDay: Number(values.pricePerDay),
  location: values.location.trim(),
  description: values.description.trim(),
})

export const AdminServiceForm = ({
  title,
  description,
  values,
  submitLabel,
  isSubmitting,
  error,
  onChange,
  onSubmit,
}: AdminServiceFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
        <input
          value={values.title}
          onChange={(event) => onChange('title', event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
          placeholder="Grand banquet hall"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
        <select
          value={values.category}
          onChange={(event) => onChange('category', event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.toUpperCase()}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Price Per Day</span>
          <input
            value={values.pricePerDay}
            onChange={(event) => onChange('pricePerDay', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
            placeholder="15000"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Location</span>
          <input
            value={values.location}
            onChange={(event) => onChange('location', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
            placeholder="Kochi"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
        <textarea
          rows={5}
          value={values.description}
          onChange={(event) => onChange('description', event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand focus:outline-none"
          placeholder="Describe the service offering"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
