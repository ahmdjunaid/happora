import { useState } from 'react'

export const useAuthForm = <TData extends Record<string, string>>(initialState: TData) => {
  const [formData, setFormData] = useState<TData>(initialState)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (name: string, value: string) => {
    setFormData((current) => ({ ...current, [name as keyof TData]: value }))
  }

  const resetMessages = () => {
    setError('')
    setSuccess('')
  }

  return {
    formData,
    setFormData,
    error,
    setError,
    success,
    setSuccess,
    isSubmitting,
    setIsSubmitting,
    updateField,
    resetMessages,
  }
}
