export default function LoadingSkeleton({ lines = 3, label = 'Loading weather...' }) {
  return (
    <div className="panel p-6 animate-pulse" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-slate-200 dark:bg-white/10"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  )
}
