import type { PropsWithChildren } from 'react'
import type { AuthView } from '../types/auth.types'

interface AuthShellProps extends PropsWithChildren {
  activeView: AuthView
  onChangeView: (view: AuthView) => void
}

const viewLabels: Array<{ id: AuthView; label: string }> = [
  { id: 'login', label: 'Login' },
  { id: 'register', label: 'Register' },
  { id: 'forgot-password', label: 'Forgot password' },
]

export const AuthShell = ({ activeView, onChangeView, children }: AuthShellProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-sm backdrop-blur md:p-10">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Happora event booking
          </div>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            Book unforgettable events without the friction.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
            Sign in or create an account to explore event services, view details, and
            manage your bookings in one place.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-brand-soft p-4">
              <p className="text-2xl font-semibold text-brand">120+</p>
              <p className="text-sm text-slate-500">Verified vendors</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-semibold text-slate-900">5k+</p>
              <p className="text-sm text-slate-500">Event moments</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-semibold text-slate-900">24/7</p>
              <p className="text-sm text-slate-500">Booking access</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <nav className="mb-6 flex flex-wrap gap-2" aria-label="Authentication views">
          {viewLabels.map((view) => (
            <button
              key={view.id}
              type="button"
              className={
                view.id === activeView
                  ? 'rounded-full bg-brand px-4 py-2 text-sm font-medium text-white'
                  : 'rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500'
              }
              onClick={() => onChangeView(view.id)}
            >
              {view.label}
            </button>
          ))}
          </nav>

          {children}
        </section>
      </div>
    </main>
  )
}
