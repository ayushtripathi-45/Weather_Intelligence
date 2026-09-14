import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { searchLocationVideos } from '../services/youtubeService.js'
import AppError from '../utils/AppError.js'

export const getVideos = asyncHandler(async (req, res) => {
  const { location } = req.query
  if (!location || !location.trim()) {
    throw new AppError('A "location" query parameter is required.', 400, 'LOCATION_REQUIRED')
  }

  try {
    const videos = await searchLocationVideos(location)
    sendSuccess(res, { data: { videos }, message: 'Videos retrieved successfully' })
  } catch (err) {
    // YouTube must never break the core weather experience.
    sendSuccess(res, { data: { videos: [] }, message: 'Videos are temporarily unavailable' })
  }
})
