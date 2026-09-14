import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-24 text-center flex flex-col items-center gap-4">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-mist">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary w-fit">Back to Weather</Link>
    </div>
  )
}
