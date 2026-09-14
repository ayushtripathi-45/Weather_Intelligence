import asyncHandler from '../utils/asyncHandler.js'
import WeatherHistory from '../models/WeatherHistory.js'
import { toCSV, toJSON, streamPDF } from '../services/exportService.js'
import AppError from '../utils/AppError.js'

export const exportJSON = asyncHandler(async (req, res) => {
  const records = await WeatherHistory.find().sort({ createdAt: -1 })
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', 'attachment; filename="weather-history.json"')
  res.status(200).send(JSON.stringify(toJSON(records), null, 2))
})

export const exportCSV = asyncHandler(async (req, res) => {
  const records = await WeatherHistory.find().sort({ createdAt: -1 })
  const csv = toCSV(records)
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="weather-history.csv"')
  res.status(200).send(csv)
})

export const exportPDF = asyncHandler(async (req, res) => {
  try {
    const records = await WeatherHistory.find().sort({ createdAt: -1 })
    streamPDF(records, res)
  } catch (err) {
    throw new AppError('Unable to generate PDF export.', 500, 'EXPORT_FAILED')
  }
})
