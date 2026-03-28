import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../routes/AuthProvider'

export const UserRoute = () => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const normalizedRole = user?.role?.toUpperCase()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (normalizedRole === 'ADMIN') {
    return <Navigate to="/admin/services" replace />
  }

  if (normalizedRole !== 'USER') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
