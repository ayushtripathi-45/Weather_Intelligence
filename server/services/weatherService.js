import axios from 'axios'
import AppError from '../utils/AppError.js'
import { env } from '../config/env.js'
import { geocodeLocation, reverseGeocodeCoords } from './geocodingService.js'

const OWM_BASE = 'https://api.openweathermap.org/data/2.5'
const ICON_BASE = 'https://openweathermap.org/img/wn'

function iconUrl(iconCode) {
  return iconCode ? `${ICON_BASE}/${iconCode}@2x.png` : null
}

function normalizeCurrent(raw) {
  return {
    temperature: raw.main?.temp,
    feelsLike: raw.main?.feels_like,
    humidity: raw.main?.humidity,
    pressure: raw.main?.pressure,
    windSpeed: raw.wind?.speed !== undefined ? Math.round(raw.wind.speed * 3.6) : null, // m/s -> km/h
    windDirection: degToCompass(raw.wind?.deg),
    visibility: raw.visibility !== undefined ? Math.round(raw.visibility / 1000) : null, // m -> km
    cloudCoverage: raw.clouds?.all,
    uvIndex: null, // Not available on the free /weather endpoint
    condition: raw.weather?.[0]?.description,
    icon: iconUrl(raw.weather?.[0]?.icon),
    sunrise: raw.sys?.sunrise ? new Date(raw.sys.sunrise * 1000) : null,
    sunset: raw.sys?.sunset ? new Date(raw.sys.sunset * 1000) : null
  }
}

function degToCompass(deg) {
  if (deg === undefined || deg === null) return null
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(deg / 45) % 8]
}

/**
 * OpenWeatherMap's free /forecast endpoint returns 3-hour steps for 5 days.
 * We collapse those into one summary entry per calendar day.
 */
function aggregateDailyForecast(list) {
  const byDay = new Map()

  for (const entry of list) {
    const day = entry.dt_txt.split(' ')[0]
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day).push(entry)
  }

  const days = [...byDay.entries()].slice(0, 5).map(([day, entries]) => {
    const temps = entries.map((e) => e.main.temp)
    const pops = entries.map((e) => e.pop ?? 0)
    // Prefer the entry closest to midday for a representative icon/condition.
    const midday = entries.reduce((best, e) => {
      const hour = Number(e.dt_txt.split(' ')[1].split(':')[0])
      const bestHour = Number(best.dt_txt.split(' ')[1].split(':')[0])
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? e : best
    }, entries[0])

    return {
      date: new Date(`${day}T12:00:00Z`),
      minTemperature: Math.min(...temps),
      maxTemperature: Math.max(...temps),
      condition: midday.weather?.[0]?.description,
      icon: iconUrl(midday.weather?.[0]?.icon),
      humidity: midday.main?.humidity,
      precipitationProbability: Math.round(Math.max(...pops) * 100)
    }
  })

  return days
}

async function fetchAlerts(lat, lon) {
  // Alerts require the One Call API (paid tier on some plans). We try it,
  // but never let a failure here break the core weather experience.
  try {
    const { data } = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
      params: { lat, lon, exclude: 'minutely,hourly,daily,current', appid: env.weatherApiKey, units: 'metric' }
    })
    return (data.alerts || []).map((a) => ({
      event: a.event,
      description: a.description?.slice(0, 300)
    }))
  } catch {
    return []
  }
}

async function resolvePrimaryLocation(query) {
  const candidates = await geocodeLocation(query)
  return { location: candidates[0], suggestions: candidates.slice(1, 4) }
}

export async function getCurrentWeather(query) {
  if (!env.weatherApiKey) {
    throw new AppError('Weather service is not configured (missing WEATHER_API_KEY).', 503, 'SERVICE_UNAVAILABLE')
  }

  const { location, suggestions } = await resolvePrimaryLocation(query)

  let raw
  try {
    const res = await axios.get(`${OWM_BASE}/weather`, {
      params: { lat: location.lat, lon: location.lon, units: 'metric', appid: env.weatherApiKey }
    })
    raw = res.data
  } catch (err) {
    if (err.response?.status === 404) {
      throw new AppError('Location not found. Please try another city, landmark, or postal code.', 404, 'LOCATION_NOT_FOUND')
    }
    throw new AppError('Weather service is temporarily unavailable. Please try again later.', 503, 'WEATHER_API_ERROR')
  }

  return {
    location: {
      name: raw.name || location.name,
      state: location.state,
      country: raw.sys?.country || location.country,
      latitude: location.lat,
      longitude: location.lon
    },
    weather: normalizeCurrent(raw),
    suggestions
  }
}

export async function getForecast(query) {
  if (!env.weatherApiKey) {
    throw new AppError('Weather service is not configured (missing WEATHER_API_KEY).', 503, 'SERVICE_UNAVAILABLE')
  }

  const { location } = await resolvePrimaryLocation(query)

  let raw
  try {
    const res = await axios.get(`${OWM_BASE}/forecast`, {
      params: { lat: location.lat, lon: location.lon, units: 'metric', appid: env.weatherApiKey }
    })
    raw = res.data
  } catch (err) {
    if (err.response?.status === 404) {
      throw new AppError('Location not found. Please try another city, landmark, or postal code.', 404, 'LOCATION_NOT_FOUND')
    }
    throw new AppError('Weather service is temporarily unavailable. Please try again later.', 503, 'WEATHER_API_ERROR')
  }

  const forecast = aggregateDailyForecast(raw.list || [])
  const alerts = await fetchAlerts(location.lat, location.lon)

  return { forecast, alerts, location: { name: location.name, latitude: location.lat, longitude: location.lon } }
}

export async function getWeatherByCoords(lat, lon) {
  const [locationCandidate] = await reverseGeocodeCoords(lat, lon)
  const query = `${lat},${lon}`
  const current = await getCurrentWeather(query)
  return {
    ...current,
    location: { ...current.location, name: locationCandidate?.name || current.location.name }
  }
}
