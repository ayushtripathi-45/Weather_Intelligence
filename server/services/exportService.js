import PDFDocument from 'pdfkit'

const CSV_COLUMNS = [
  ['location.name', 'Location'],
  ['location.country', 'Country'],
  ['location.latitude', 'Latitude'],
  ['location.longitude', 'Longitude'],
  ['requestedDateRange.startDate', 'Start Date'],
  ['requestedDateRange.endDate', 'End Date'],
  ['weather.temperature', 'Temperature'],
  ['weather.feelsLike', 'Feels Like'],
  ['weather.humidity', 'Humidity'],
  ['weather.pressure', 'Pressure'],
  ['weather.windSpeed', 'Wind Speed'],
  ['weather.condition', 'Condition'],
  ['createdAt', 'Created At']
]

function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc === undefined || acc === null ? acc : acc[key]), obj)
}

function csvEscape(value) {
  if (value === undefined || value === null) return ''
  const str = value instanceof Date ? value.toISOString() : String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function toCSV(records) {
  const header = CSV_COLUMNS.map(([, label]) => csvEscape(label)).join(',')
  const rows = records.map((record) =>
    CSV_COLUMNS.map(([path]) => csvEscape(getPath(record.toObject ? record.toObject() : record, path))).join(',')
  )
  return [header, ...rows].join('\n')
}

export function toJSON(records) {
  return records.map((r) => (r.toObject ? r.toObject() : r))
}

/**
 * Streams a simple tabular PDF summary of the saved weather records.
 */
export function streamPDF(records, res) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename="weather-history.pdf"')
  doc.pipe(res)

  doc.fontSize(18).text('Weather Intelligence — Saved Searches', { underline: true })
  doc.moveDown()

  records.forEach((r, i) => {
    const record = r.toObject ? r.toObject() : r
    doc
      .fontSize(12)
      .text(`${i + 1}. ${record.location?.name || 'Unknown'}, ${record.location?.country || ''}`, { continued: false })
    doc
      .fontSize(10)
      .fillColor('#555')
      .text(
        `Date range: ${new Date(record.requestedDateRange?.startDate).toDateString()} - ${new Date(
          record.requestedDateRange?.endDate
        ).toDateString()}`
      )
    doc.text(
      `Temp: ${record.weather?.temperature ?? '—'}°C  Feels like: ${record.weather?.feelsLike ?? '—'}°C  Condition: ${
        record.weather?.condition ?? '—'
      }`
    )
    doc.fillColor('#000').moveDown()
  })

  if (records.length === 0) {
    doc.text('No saved weather records yet.')
  }

  doc.end()
}
