import type { FormEvent } from 'react'
import type { ServiceFilters as ServiceFiltersType } from '../types/service'
import { categories as hardcodedCategories } from '../utils/categories'

interface ServiceFiltersProps {
  filters: ServiceFiltersType
  categories: string[]
  onChange: (name: keyof ServiceFiltersType, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export const ServiceFilters = ({
  filters,
  categories,
  onChange,
  onSubmit,
}: ServiceFiltersProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Refine Search</h2>
        <p className="mt-1 text-sm text-slate-500">Find the right service for your event.</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Search</span>
          <input
            value={filters.keyword}
            onChange={(event) => onChange('keyword', event.target.value)}
            placeholder="Search by title"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 placeholder:text-slate-400 focus:border-brand"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
          <select
            value={filters.category}
            onChange={(event) => onChange('category', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand"
          >
            <option value="">All categories</option>
            {[...new Set([...hardcodedCategories, ...categories])].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Location</span>
          <input
            value={filters.location}
            onChange={(event) => onChange('location', event.target.value)}
            placeholder="Enter location"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 placeholder:text-slate-400 focus:border-brand"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white"
      >
        Apply Filters
      </button>
    </form>
  )
}
