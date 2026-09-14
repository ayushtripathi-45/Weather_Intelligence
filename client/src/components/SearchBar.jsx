import { useState } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { validateLocation } from '../utils/validators.js'

export default function SearchBar({ onSearch, onUseLocation, locating }) {
  const [value, setValue] = useState('')
  const [formError, setFormError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validateLocation(value)
    if (err) {
      setFormError(err)
      return
    }
    setFormError(null)
    onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="location-search" className="sr-only">
            Search city, landmark, postal code
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={18} />
            <input
              id="location-search"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search city, landmark, postal code..."
              className="input-field pl-10"
              aria-invalid={Boolean(formError)}
              aria-describedby={formError ? 'location-search-error' : undefined}
            />
          </div>
          {formError && (
            <p id="location-search-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formError}
            </p>
          )}
        </div>

        <button type="submit" className="btn-primary whitespace-nowrap">
          <Search size={16} />
          Search
        </button>

        <button
          type="button"
          onClick={onUseLocation}
          className="btn-secondary whitespace-nowrap"
          disabled={locating}
        >
          {locating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
          Use My Location
        </button>
      </div>
    </form>
  )
}
