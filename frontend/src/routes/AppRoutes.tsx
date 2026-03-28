import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoute } from '../components/AdminRoute'
import { UserRoute } from '../components/UserRoute'
import { AuthPage } from '../features/auth/pages/AuthPage'
import { VerifyOtpPage } from '../features/auth/pages/VerifyOtpPage'
import { AdminBookingsPage } from '../pages/AdminBookingsPage'
import { AdminServiceFormPage } from '../pages/AdminServiceFormPage'
import { AdminServicesPage } from '../pages/AdminServicesPage'
import { BookingPage } from '../pages/BookingPage'
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
          <Route path="/verify-otp" element={<VerifyOtpPage />} />

          <Route element={<UserRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/:id" element={<ServiceDetailsPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/services/add" element={<AdminServiceFormPage />} />
            <Route path="/admin/services/edit/:id" element={<AdminServiceFormPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
