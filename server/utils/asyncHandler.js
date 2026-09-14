// Wraps async route handlers so rejected promises reach the
// centralized error middleware instead of crashing the process.
export default function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
