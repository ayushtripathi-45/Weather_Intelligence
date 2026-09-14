import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import * as weatherService from '../services/weatherService.js'

export const getCurrent = asyncHandler(async (req, res) => {
  const { location } = req.query
  const data = await weatherService.getCurrentWeather(location)
  sendSuccess(res, { data, message: 'Weather retrieved successfully' })
})

export const getForecast = asyncHandler(async (req, res) => {
  const { location } = req.query
  const data = await weatherService.getForecast(location)
  sendSuccess(res, { data, message: 'Forecast retrieved successfully' })
})

export const getByCoordinates = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query
  const data = await weatherService.getWeatherByCoords(Number(lat), Number(lon))
  sendSuccess(res, { data, message: 'Weather retrieved successfully' })
})
