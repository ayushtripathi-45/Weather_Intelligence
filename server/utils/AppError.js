/**
 * Standard operational error used across the app.
 * Controllers/services throw this; the central error handler
 * turns it into the { success, message, error } response shape.
 */
export default class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}
