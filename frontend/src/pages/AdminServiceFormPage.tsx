import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AdminServiceForm,
  type AdminServiceFormValues,
  getServicePayloadFromForm,
} from '../components/AdminServiceForm'
import { AppShell } from '../components/AppShell'
import { createService, getServiceById, updateService } from '../services/serviceApi'
import { useAuth } from '../routes/AuthProvider'

const adminLinks = [
  { to: '/admin/services', label: 'Manage Services' },
  { to: '/admin/bookings', label: 'Bookings' },
]

const initialValues: AdminServiceFormValues = {
  title: '',
  category: '',
  pricePerDay: '',
  totalSlots: '',
  location: '',
  description: '',
}

export const AdminServiceFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, logout } = useAuth()
  const [values, setValues] = useState<AdminServiceFormValues>(initialValues)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id || !user?.id) {
      return
    }

    const loadService = async () => {
      try {
        const response = await getServiceById(id)
        if (response.service.providerId !== user.id) {
          navigate('/admin/services', { replace: true })
          return
        }
        setValues({
          title: response.service.title,
          category: response.service.category,
          pricePerDay: String(response.service.pricePerDay),
          totalSlots: String(response.service.totalSlots),
          location: response.service.location,
          description: response.service.description || '',
        })
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : 'Failed to load service.',
        )
      }
    }

    void loadService()
  }, [id, navigate, user?.id])

  const handleChange = (name: keyof AdminServiceFormValues, value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError('')
      const payload = getServicePayloadFromForm(values)

      if (id) {
        await updateService(id, payload)
      } else {
        await createService(payload)
      }

      navigate('/admin/services')
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Failed to save service.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell userName={user?.name} onLogout={logout} links={adminLinks}>
      <AdminServiceForm
        title={id ? 'Edit service' : 'Add service'}
        description="Use the same form to create or update event services."
        values={values}
        submitLabel={id ? 'Update Service' : 'Create Service'}
        isSubmitting={isSubmitting}
        error={error}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </AppShell>
  )
}
