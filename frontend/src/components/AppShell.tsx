import type { PropsWithChildren } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

interface AppShellProps extends PropsWithChildren {
  userName?: string
  onLogout?: () => void
}

export const AppShell = ({ userName, onLogout, children }: AppShellProps) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen px-5 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-[2rem] border border-slate-200/80 bg-white/90 px-6 py-5 shadow-sm backdrop-blur md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <Link to="/" className="text-2xl font-semibold tracking-tight text-brand">
                Happora
              </Link>
              <p className="mt-1 text-sm text-slate-500">
                Event booking made simple and reliable.
              </p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <nav className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium ${
                      isActive ? 'bg-white text-brand shadow-sm' : 'text-slate-500'
                    }`
                  }
                >
                  Explore
                </NavLink>
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium ${
                      isActive ? 'bg-white text-brand shadow-sm' : 'text-slate-500'
                    }`
                  }
                >
                  My Bookings
                </NavLink>
              </nav>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                  {userName ? `Hi, ${userName}` : 'Authenticated user'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onLogout?.()
                    navigate('/login')
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
