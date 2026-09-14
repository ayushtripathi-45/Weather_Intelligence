export function formatTemp(value, unit = '°C') {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${Math.round(value)}${unit}`
}

export function formatDate(dateInput, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  if (!dateInput) return '—'
  const d = new Date(dateInput)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, options)
}

export function formatTime(dateInput) {
  if (!dateInput) return '—'
  const d = new Date(dateInput)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function toISODate(date) {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
