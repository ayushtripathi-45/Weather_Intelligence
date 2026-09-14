import ForecastCard from './ForecastCard.jsx'
import EmptyState from './EmptyState.jsx'

export default function ForecastGrid({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return <EmptyState title="No forecast available" message="Search for a location to see the 5-day outlook." />
  }

  return (
    <section aria-label="5-day forecast">
      <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible">
        {forecast.slice(0, 5).map((day, i) => (
          <ForecastCard key={day.date || i} day={day} isToday={i === 0} />
        ))}
      </div>
    </section>
  )
}
