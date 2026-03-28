const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const formatLocalDate = (value: string | Date): string =>
  dateFormatter.format(new Date(value))

export const formatLocalDateRange = (
  startDate: string | Date,
  endDate: string | Date,
): string => `${formatLocalDate(startDate)} - ${formatLocalDate(endDate)}`

export const getTodayDateValue = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
