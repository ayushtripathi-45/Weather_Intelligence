import { formatTemp, formatDate } from '../utils/formatters.js'

export default function ForecastCard({ day, isToday }) {
  return (
    <div className="panel p-4 flex flex-col items-center text-center gap-2 min-w-[130px]">
      <p className="text-sm font-medium">{isToday ? 'Today' : formatDate(day.date)}</p>
      {day.icon && <img src={day.icon} alt={day.condition} width={44} height={44} />}
      <p className="text-xs text-mist">{day.condition}</p>
      <p className="font-mono tabular text-sm">
        <span className="font-semibold">{formatTemp(day.maxTemperature)}</span>
        <span className="text-mist"> / {formatTemp(day.minTemperature)}</span>
      </p>
      <p className="text-xs text-mist">Rain {day.precipitationProbability ?? 0}%</p>
    </div>
  )
}
