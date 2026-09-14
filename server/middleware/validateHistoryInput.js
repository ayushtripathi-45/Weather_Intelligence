import AppError from '../utils/AppError.js'

function isValidDate(value) {
  const d = new Date(value)
  return !Number.isNaN(d.getTime())
}

export function validateHistoryInput(req, res, next) {
  const { location, startDate, endDate } = req.body

  if (!location || !String(location).trim()) {
    return next(new AppError('Location is required.', 400, 'LOCATION_REQUIRED'))
  }
  if (!startDate) {
    return next(new AppError('Start date is required.', 400, 'START_DATE_REQUIRED'))
  }
  if (!endDate) {
    return next(new AppError('End date is required.', 400, 'END_DATE_REQUIRED'))
  }
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return next(new AppError('Please provide valid dates.', 422, 'INVALID_DATE'))
  }
  if (new Date(startDate) > new Date(endDate)) {
    return next(new AppError('Start date cannot be after the end date.', 422, 'INVALID_DATE_RANGE'))
  }

  next()
}

export function validateObjectId(req, res, next) {
  const { id } = req.params
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id)
  if (!isValidObjectId) {
    return next(new AppError('Invalid weather record ID.', 400, 'INVALID_ID'))
  }
  next()
}
