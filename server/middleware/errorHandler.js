import { env } from '../config/env.js'

// Centralized error handler. Every thrown AppError (or unexpected error)
// lands here and is turned into the standard { success, message, error } shape.
// Stack traces are only logged server-side, never sent to the client.
export default function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500
  const errorCode = err.errorCode || 'INTERNAL_ERROR'
  const message = err.isOperational ? err.message : 'Something went wrong. Please try again later.'

  if (env.nodeEnv === 'development') {
    console.error(err)
  } else if (!err.isOperational) {
    console.error('Unexpected error:', err.message)
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorCode
  })
}
