import { useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import LocationMap from '../components/LocationMap.jsx'
import { searchLocations } from '../services/weatherService.js'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function MapPage() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  const handleSearch = async (query) => {
    setError(null)
    try {
      const res = await searchLocations(query)
      const match = res.data?.[0]
      if (!match) {
        setError('Location not found. Please try another city, landmark, or postal code.')
        return
      }
      setLocation({
        name: [match.name, match.state, match.country].filter(Boolean).join(', '),
        latitude: match.lat,
        longitude: match.lon
      })
    } catch (err) {
      setError(err?.response?.data?.message || 'Location not found.')
    }
  }

  return (
    <div className="py-10 flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Map</h1>
      <SearchBar onSearch={handleSearch} onUseLocation={() => {}} locating={false} />

      {error && <ErrorState message={error} />}
      {!error && !location && (
        <EmptyState title="Search for a place" message="Find a location above to see it on the map." />
      )}
      {location && <LocationMap location={location} />}
    </div>
  )
}
