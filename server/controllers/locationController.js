import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { geocodeLocation } from '../services/geocodingService.js'
import { getMapData } from '../services/mapService.js'
import AppError from '../utils/AppError.js'

export const search = asyncHandler(async (req, res) => {
  const { q } = req.query
  if (!q || !q.trim()) {
    throw new AppError('A search query "q" is required.', 400, 'QUERY_REQUIRED')
  }
  const results = await geocodeLocation(q)
  sendSuccess(res, { data: results, message: 'Locations found' })
})

export const map = asyncHandler(async (req, res) => {
  const { location } = req.query
  const data = await getMapData(location)
  sendSuccess(res, { data, message: 'Map data retrieved successfully' })
})
