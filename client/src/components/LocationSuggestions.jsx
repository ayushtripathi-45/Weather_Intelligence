export default function LocationSuggestions({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="panel p-4 mt-3">
      <p className="text-sm text-mist mb-2">Did you mean?</p>
      <ul className="flex flex-col gap-1">
        {suggestions.map((s) => (
          <li key={`${s.name}-${s.lat}-${s.lon}`}>
            <button
              type="button"
              onClick={() => onSelect(s)}
              className="text-left w-full px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-sm"
            >
              {s.name}
              {s.state ? `, ${s.state}` : ''}
              {s.country ? `, ${s.country}` : ''}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
