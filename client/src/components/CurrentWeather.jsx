import { formatTemp, formatTime, capitalize } from '../utils/formatters.js'
import WeatherStats from './WeatherStats.jsx'

export default function CurrentWeather({ data }) {
  if (!data) return null
  const { location, weather } = data

  return (
    <section className="panel p-6 sm:p-8" aria-label="Current weather">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold">
            {location.name}
            {location.state ? `, ${location.state}` : ''}
          </h2>
          <p className="text-mist">{location.country}</p>

          <div className="mt-6 flex items-center gap-4">
            {weather.icon && (
              <img
                src={weather.icon}
                alt={weather.condition}
                width={72}
                height={72}
                className="shrink-0"
              />
            )}
            <div>
              <p className="text-5xl font-mono tabular font-semibold leading-none">
                {formatTemp(weather.temperature)}
              </p>
              <p className="text-mist mt-2">{capitalize(weather.condition)}</p>
              <p className="text-sm text-mist">Feels like {formatTemp(weather.feelsLike)}</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-mist sm:text-right">
          <p>Sunrise {formatTime(weather.sunrise)}</p>
          <p>Sunset {formatTime(weather.sunset)}</p>
        </div>
      </div>

      <div className="divider my-6" />

      <WeatherStats weather={weather} />
    </section>
  )
}
