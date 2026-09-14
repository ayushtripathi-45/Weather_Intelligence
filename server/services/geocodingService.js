import axios from 'axios'
import AppError from '../utils/AppError.js'
import { env } from '../config/env.js'

const OWM_GEO_BASE = 'https://api.openweathermap.org/geo/1.0'
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

const COORDS_PATTERN = /^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/
const ZIP_PATTERN = /^\d{4,6}(,[A-Za-z]{2})?$/

function isCoordinateQuery(query) {
  return COORDS_PATTERN.test(query)
}

function parseCoordinateQuery(query) {
  const match = query.match(COORDS_PATTERN)
  return { lat: Number(match[1]), lon: Number(match[3]) }
}

function normalizeOwmResult(item) {
  return {
    name: item.name,
    state: item.state || null,
    country: item.country || null,
    lat: item.lat,
    lon: item.lon
  }
}

function normalizeNominatimResult(item) {
  const parts = item.display_name?.split(',').map((p) => p.trim()) || []
  return {
    name: item.name || parts[0] || item.display_name,
    state: parts.length > 2 ? parts[parts.length - 2] : null,
    country: parts[parts.length - 1] || null,
    lat: Number(item.lat),
    lon: Number(item.lon)
  }
}

async function reverseGeocode(lat, lon) {
  const { data } = await axios.get(`${OWM_GEO_BASE}/reverse`, {
    params: { lat, lon, limit: 1, appid: env.weatherApiKey }
  })
  if (!data || data.length === 0) {
    return [{ name: 'Selected location', state: null, country: null, lat, lon }]
  }
  return [normalizeOwmResult(data[0])]
}

async function directGeocode(query) {
  const { data } = await axios.get(`${OWM_GEO_BASE}/direct`, {
    params: { q: query, limit: 5, appid: env.weatherApiKey }
  })
  return (data || []).map(normalizeOwmResult)
}

async function zipGeocode(query) {
  const zip = query.includes(',') ? query : `${query},US`
  try {
    const { data } = await axios.get(`${OWM_GEO_BASE}/zip`, {
      params: { zip, appid: env.weatherApiKey }
    })
    if (!data) return []
    return [{ name: data.name, state: null, country: data.country, lat: data.lat, lon: data.lon }]
  } catch {
    return []
  }
}

async function nominatimSearch(query) {
  try {
    const { data } = await axios.get(`${NOMINATIM_BASE}/search`, {
      params: { q: query, format: 'json', limit: 5 },
      headers: { 'User-Agent': 'weather-intelligence-app' }
    })
    return (data || []).map(normalizeNominatimResult)
  } catch {
    return []
  }
}

/**
 * Resolves a free-text location query (city, landmark, postal code, or
 * "lat,lon" coordinates) into one or more normalized candidates:
 * { name, state, country, lat, lon }.
 */
export async function geocodeLocation(query) {
  if (!env.weatherApiKey) {
    throw new AppError('Weather service is not configured (missing WEATHER_API_KEY).', 503, 'SERVICE_UNAVAILABLE')
  }

  const trimmed = query.trim()

  if (isCoordinateQuery(trimmed)) {
    const { lat, lon } = parseCoordinateQuery(trimmed)
    return reverseGeocode(lat, lon)
  }

  let results = await directGeocode(trimmed)

  if (results.length === 0 && ZIP_PATTERN.test(trimmed)) {
    results = await zipGeocode(trimmed)
  }

  if (results.length === 0) {
    results = await nominatimSearch(trimmed)
  }

  if (results.length === 0) {
    throw new AppError(
      'Location not found. Please try another city, landmark, or postal code.',
      404,
      'LOCATION_NOT_FOUND'
    )
  }

  return results
}

export async function reverseGeocodeCoords(lat, lon) {
  if (!env.weatherApiKey) {
    throw new AppError('Weather service is not configured (missing WEATHER_API_KEY).', 503, 'SERVICE_UNAVAILABLE')
  }
  return reverseGeocode(lat, lon)
}
