import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import AppError from '../utils/AppError.js'
import WeatherHistory from '../models/WeatherHistory.js'
import * as weatherService from '../services/weatherService.js'

async function buildRecordPayload(location, startDate, endDate) {
  const current = await weatherService.getCurrentWeather(location)
  const { forecast } = await weatherService.getForecast(location)

  return {
    location: {
      name: current.location.name,
      country: current.location.country,
      state: current.location.state,
      latitude: current.location.latitude,
      longitude: current.location.longitude
    },
    requestedDateRange: { startDate, endDate },
    weather: current.weather,
    forecast
  }
}

export const createRecord = asyncHandler(async (req, res) => {
  const { location, startDate, endDate } = req.body
  const payload = await buildRecordPayload(location, startDate, endDate)
  const record = await WeatherHistory.create(payload)
  sendSuccess(res, { statusCode: 201, data: record, message: 'Weather record saved successfully' })
})

export const listRecords = asyncHandler(async (req, res) => {
  const { search, sort = 'newest', date } = req.query

  const filter = {}
  if (search) {
    filter['location.name'] = { $regex: search, $options: 'i' }
  }
  if (date) {
    const day = new Date(date)
    const nextDay = new Date(day)
    nextDay.setDate(day.getDate() + 1)
    filter.createdAt = { $gte: day, $lt: nextDay }
  }

  const sortOrder = sort === 'oldest' ? 1 : -1

  const records = await WeatherHistory.find(filter).sort({ createdAt: sortOrder })
  sendSuccess(res, { data: records, message: 'History retrieved successfully' })
})

export const getRecord = asyncHandler(async (req, res) => {
  const record = await WeatherHistory.findById(req.params.id)
  if (!record) {
    throw new AppError('Weather record not found.', 404, 'RECORD_NOT_FOUND')
  }
  sendSuccess(res, { data: record, message: 'Record retrieved successfully' })
})

export const updateRecord = asyncHandler(async (req, res) => {
  const existing = await WeatherHistory.findById(req.params.id)
  if (!existing) {
    throw new AppError('Weather record not found.', 404, 'RECORD_NOT_FOUND')
  }

  const { location, startDate, endDate } = req.body

  // Only re-fetch live weather if the location actually changed; otherwise
  // just update the stored date range to avoid unnecessary API calls.
  const locationChanged = location && location.trim() !== existing.location.name
  const payload = locationChanged
    ? await buildRecordPayload(location, startDate, endDate)
    : { requestedDateRange: { startDate, endDate } }

  Object.assign(existing, payload)
  await existing.save()

  sendSuccess(res, { data: existing, message: 'Weather record updated successfully' })
})

export const deleteRecord = asyncHandler(async (req, res) => {
  const record = await WeatherHistory.findByIdAndDelete(req.params.id)
  if (!record) {
    throw new AppError('Weather record not found.', 404, 'RECORD_NOT_FOUND')
  }
  sendSuccess(res, { data: { id: req.params.id }, message: 'Weather record deleted successfully' })
})
