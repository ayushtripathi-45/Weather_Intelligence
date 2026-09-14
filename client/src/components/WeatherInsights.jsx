import { CloudRain, Shirt, Wind } from 'lucide-react'

function buildInsights(weather, forecast) {
  const insights = []

  if (weather?.windSpeed !== undefined) {
    insights.push({
      icon: Wind,
      text:
        weather.windSpeed > 25
          ? 'Strong winds expected — secure loose items outdoors.'
          : 'Wind conditions are moderate today.'
    })
  }

  if (weather?.temperature !== undefined) {
    insights.push({
      icon: Shirt,
      text:
        weather.temperature >= 28
          ? 'Light, breathable clothing should be comfortable.'
          : weather.temperature <= 12
          ? 'Layer up — it will feel cool outside.'
          : 'Comfortable conditions for most outdoor activity.'
    })
  }

  const rainyDay = forecast?.find((d) => (d.precipitationProbability ?? 0) >= 40)
  if (rainyDay) {
    insights.push({
      icon: CloudRain,
      text: `Rain is likely around ${new Date(rainyDay.date).toLocaleDateString(undefined, {
        weekday: 'long'
      })}. Consider carrying an umbrella.`
    })
  }

  return insights
}

export default function WeatherInsights({ weather, forecast }) {
  const insights = buildInsights(weather, forecast)

  if (insights.length === 0) return null

  return (
    <section className="panel p-6" aria-label="Weather insights">
      <h3 className="text-lg font-semibold mb-4">Weather Insights</h3>
      <ul className="flex flex-col gap-3">
        {insights.map((insight, i) => {
          const Icon = insight.icon
          return (
            <li key={i} className="flex items-start gap-3">
              <Icon size={18} className="text-teal shrink-0 mt-0.5" />
              <span className="text-sm">{insight.text}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
