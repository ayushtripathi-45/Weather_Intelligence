import { Droplets, Wind, Gauge, Eye, Cloud, Sun } from 'lucide-react'

const stat = (label, value, Icon) => (
  <div className="flex items-center gap-3" key={label}>
    <Icon size={18} className="text-mist shrink-0" />
    <div>
      <p className="text-xs text-mist">{label}</p>
      <p className="font-mono tabular text-sm">{value}</p>
    </div>
  </div>
)

export default function WeatherStats({ weather }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
      {stat('Humidity', `${weather.humidity ?? '—'}%`, Droplets)}
      {stat('Wind', `${weather.windSpeed ?? '—'} km/h ${weather.windDirection ?? ''}`, Wind)}
      {stat('Pressure', `${weather.pressure ?? '—'} hPa`, Gauge)}
      {stat('Visibility', `${weather.visibility ?? '—'} km`, Eye)}
      {stat('Cloud Cover', `${weather.cloudCoverage ?? '—'}%`, Cloud)}
      {stat('UV Index', weather.uvIndex ?? 'N/A', Sun)}
    </div>
  )
}
