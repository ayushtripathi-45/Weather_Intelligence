import { createContext, useContext, useState, useCallback } from 'react'
import { getCurrentWeather, getForecast } from '../services/weatherService.js'

const WeatherContext = createContext(null)

export function WeatherProvider({ children }) {
  const [location, setLocation] = useState(null)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchLocation = useCallback(async (query) => {
    setLoading(true)
    setError(null)
    try {
      const [currentRes, forecastRes] = await Promise.all([
        getCurrentWeather(query),
        getForecast(query)
      ])
      setCurrent(currentRes.data)
      setLocation(currentRes.data.location)
      setForecast(forecastRes.data.forecast || [])
      setAlerts(forecastRes.data.alerts || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'We couldn\'t load weather for that location.')
      setCurrent(null)
      setForecast([])
    } finally {
      setLoading(false)
    }
  }, [])

  const searchByCoords = useCallback(async (lat, lon) => {
    return searchLocation(`${lat},${lon}`)
  }, [searchLocation])

  return (
    <WeatherContext.Provider
      value={{
        location,
        current,
        forecast,
        alerts,
        loading,
        error,
        searchLocation,
        searchByCoords
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider')
  return ctx
}
