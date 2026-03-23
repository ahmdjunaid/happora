import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AuthPage } from '../features/auth/pages/AuthPage'
import { HomePage } from '../pages/HomePage'
import { MyBookingsPage } from '../pages/MyBookingsPage'
import { ServiceDetailsPage } from '../pages/ServiceDetailsPage'
import { AuthProvider } from './AuthProvider'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/:id" element={<ServiceDetailsPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
