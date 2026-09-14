import AppError from '../utils/AppError.js'

/**
 * The frontend renders the interactive map itself (OpenStreetMap embed).
 * This service simply validates and normalizes coordinates/location info
 * so the client always gets a consistent { latitude, longitude, approximate } shape.
 */
export async function getMapData(location) {
  const coordsMatch = /^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/.exec(location)

  if (!coordsMatch) {
    throw new AppError('A valid "lat,lon" location is required for map lookup.', 400, 'INVALID_LOCATION')
  }

  const latitude = Number(coordsMatch[1])
  const longitude = Number(coordsMatch[3])

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new AppError('Coordinates are out of range.', 422, 'INVALID_COORDINATES')
  }

  return { latitude, longitude, approximate: false }
}
