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
    <main className="auth-layout">
      <section className="auth-hero">
        <div className="auth-hero__badge">Happora event booking</div>
        <h1>Book unforgettable events without the friction.</h1>
        <p>
          A focused sign-in experience for guests who want quick access to tickets,
          reservations, and upcoming event plans.
        </p>
        <div className="auth-hero__meta">
          <span>Fast login</span>
          <span>Easy booking access</span>
          <span>Guest-friendly recovery</span>
        </div>
      </section>

      <section className="auth-panel">
        <nav className="auth-tabs" aria-label="Authentication views">
          {viewLabels.map((view) => (
            <button
              key={view.id}
              type="button"
              className={view.id === activeView ? 'auth-tab auth-tab--active' : 'auth-tab'}
              onClick={() => onChangeView(view.id)}
            >
              {view.label}
            </button>
          ))}
        </nav>

        <div className="auth-card auth-card--compact">{children}</div>
      </section>
    </main>
  )
}
