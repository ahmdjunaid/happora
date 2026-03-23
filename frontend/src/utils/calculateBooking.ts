export const calculateBookingDays = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) {
    return 0
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  const difference = end.getTime() - start.getTime()

  if (Number.isNaN(difference) || difference <= 0) {
    return 0
  }

  return Math.ceil(difference / (1000 * 60 * 60 * 24))
}
