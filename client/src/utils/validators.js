export function validateLocation(location) {
  if (!location || !location.trim()) {
    return 'Location is required.'
  }
  if (location.trim().length < 2) {
    return 'Please enter a valid location.'
  }
  return null
}

export function validateDateRange(startDate, endDate) {
  if (!startDate) return 'Start date is required.'
  if (!endDate) return 'End date is required.'

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Please enter valid dates.'
  }
  if (start > end) {
    return 'Start date cannot be after the end date.'
  }
  return null
}
