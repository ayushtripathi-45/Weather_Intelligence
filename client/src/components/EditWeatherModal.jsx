import { useState, useEffect } from 'react'
import { validateLocation, validateDateRange } from '../utils/validators.js'
import { toISODate } from '../utils/formatters.js'

export default function EditWeatherModal({ open, record, onCancel, onSave }) {
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (record) {
      setLocation(record.location?.name || '')
      setStartDate(toISODate(record.requestedDateRange?.startDate || new Date()))
      setEndDate(toISODate(record.requestedDateRange?.endDate || new Date()))
      setErrors({})
    }
  }, [record])

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const locationError = validateLocation(location)
    const dateError = validateDateRange(startDate, endDate)
    if (locationError || dateError) {
      setErrors({ location: locationError, dates: dateError })
      return
    }
    onSave({ id: record._id, location, startDate, endDate })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="panel bg-paper dark:bg-dusk p-6 max-w-md w-full" noValidate>
        <h3 className="text-lg font-semibold mb-4">Edit Weather Record</h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="label" htmlFor="edit-location">Location</label>
            <input
              id="edit-location"
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="edit-start">Start Date</label>
              <input
                id="edit-start"
                type="date"
                className="input-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="edit-end">End Date</label>
              <input
                id="edit-end"
                type="date"
                className="input-field"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          {errors.dates && <p className="text-sm text-red-600">{errors.dates}</p>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
