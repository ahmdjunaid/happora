import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../routes/AuthProvider'

export const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth()
  const normalizedRole = user?.role?.toUpperCase()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (normalizedRole !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
