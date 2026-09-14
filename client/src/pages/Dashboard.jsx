import { useState, useEffect } from 'react'
import { useWeather } from '../context/WeatherContext.jsx'
import useGeolocation from '../hooks/useGeolocation.js'
import { createHistoryRecord } from '../services/historyService.js'
import { toISODate } from '../utils/formatters.js'
import { validateDateRange } from '../utils/validators.js'

import SearchBar from '../components/SearchBar.jsx'
import CurrentWeather from '../components/CurrentWeather.jsx'
import ForecastGrid from '../components/ForecastGrid.jsx'
import TemperatureChart from '../components/TemperatureChart.jsx'
import WeatherAlert from '../components/WeatherAlert.jsx'
import WeatherInsights from '../components/WeatherInsights.jsx'
import LocationMap from '../components/LocationMap.jsx'
import YoutubeVideos from '../components/YoutubeVideos.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import ErrorState from '../components/ErrorState.jsx'

export default function Dashboard() {
  const { location, current, forecast, alerts, loading, error, searchLocation, searchByCoords } = useWeather()
  const { coords, loading: locating, error: geoError, requestLocation } = useGeolocation()
  const [saveState, setSaveState] = useState({ status: 'idle', message: '' })
  const [range, setRange] = useState({
    startDate: toISODate(new Date()),
    endDate: toISODate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000))
  })

  // Once the browser resolves GPS coordinates, kick off the weather search.
  useEffect(() => {
    if (coords) {
      searchByCoords(coords.latitude, coords.longitude)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords])

  const handleSaveSearch = async () => {
    if (!location) return
    const dateError = validateDateRange(range.startDate, range.endDate)
    if (dateError) {
      setSaveState({ status: 'error', message: dateError })
      return
    }
    setSaveState({ status: 'saving', message: '' })
    try {
      await createHistoryRecord({
        location: location.name,
        startDate: range.startDate,
        endDate: range.endDate
      })
      setSaveState({ status: 'success', message: 'Search saved to your history.' })
    } catch (err) {
      setSaveState({
        status: 'error',
        message: err?.response?.data?.message || 'Could not save this search. Please try again.'
      })
    }
  }

  return (
    <div className="py-10 sm:py-14 flex flex-col gap-10">
      <section className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Weather Intelligence</h1>
        <p className="text-lg text-mist mt-2">Know the weather before you go.</p>
        <p className="text-mist mt-1">
          Search any city, town, landmark, postal code, or use your current location.
        </p>
      </section>

      <section>
        <SearchBar onSearch={searchLocation} onUseLocation={requestLocation} locating={locating} />
        {geoError && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{geoError}</p>}
      </section>

      {loading && <LoadingSkeleton lines={5} />}
      {!loading && error && (
        <ErrorState message={error} onRetry={() => location && searchLocation(location.name)} />
      )}

      {!loading && !error && current && (
        <>
          <CurrentWeather data={current} />

          <div className="panel p-5 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="range-start">Start Date</label>
                <input
                  id="range-start"
                  type="date"
                  className="input-field"
                  value={range.startDate}
                  onChange={(e) => setRange((r) => ({ ...r, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="label" htmlFor="range-end">End Date</label>
                <input
                  id="range-end"
                  type="date"
                  className="input-field"
                  value={range.endDate}
                  onChange={(e) => setRange((r) => ({ ...r, endDate: e.target.value }))}
                />
              </div>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSaveSearch}
              disabled={saveState.status === 'saving'}
            >
              {saveState.status === 'saving' ? 'Saving...' : 'Save This Search'}
            </button>
          </div>
          {saveState.message && (
            <p className={`text-sm ${saveState.status === 'error' ? 'text-red-600' : 'text-teal'}`}>
              {saveState.message}
            </p>
          )}

          <ForecastGrid forecast={forecast} />
          <TemperatureChart forecast={forecast} />
          <WeatherInsights weather={current.weather} forecast={forecast} />
          <WeatherAlert alerts={alerts} />
          <LocationMap location={location} />
          <YoutubeVideos location={location} />
        </>
      )}
    </div>
  )
}
