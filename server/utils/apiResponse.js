export function sendSuccess(res, { statusCode = 200, data = null, message = 'Success' } = {}) {
  return res.status(statusCode).json({ success: true, data, message })
}
