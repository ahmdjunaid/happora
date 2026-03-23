import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../routes/AuthProvider'

export const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
