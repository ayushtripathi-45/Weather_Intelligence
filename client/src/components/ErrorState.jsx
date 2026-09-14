import { AlertCircle } from 'lucide-react'

export default function ErrorState({ message = 'Unable to load weather.', onRetry }) {
  return (
    <div className="panel p-6 text-center flex flex-col items-center gap-3" role="alert">
      <AlertCircle size={28} className="text-red-500" />
      <p className="text-sm text-mist">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-1">
          Try Again
        </button>
      )}
    </div>
  )
}
