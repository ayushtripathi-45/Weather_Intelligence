import api from './api.js'

export const getCurrentWeather = (location) =>
  api.get('/weather/current', { params: { location } })

export const getForecast = (location) =>
  api.get('/weather/forecast', { params: { location } })

export const getWeatherByCoords = (lat, lon) =>
  api.get('/weather/coordinates', { params: { lat, lon } })

export const searchLocations = (q) =>
  api.get('/location/search', { params: { q } })
