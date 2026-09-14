import AppError from '../utils/AppError.js'

export function validateLocationQuery(req, res, next) {
  const { location } = req.query
  if (!location || !location.trim()) {
    return next(new AppError('A "location" query parameter is required.', 400, 'LOCATION_REQUIRED'))
  }
  next()
}

export function validateCoordinatesQuery(req, res, next) {
  const { lat, lon } = req.query
  const latitude = Number(lat)
  const longitude = Number(lon)

  if (lat === undefined || lon === undefined || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return next(new AppError('Valid "lat" and "lon" query parameters are required.', 400, 'INVALID_COORDINATES'))
  }
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return next(new AppError('Coordinates are out of range.', 422, 'INVALID_COORDINATES'))
  }
  next()
}
