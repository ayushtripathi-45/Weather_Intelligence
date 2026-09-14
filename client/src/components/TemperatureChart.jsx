import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatDate } from '../utils/formatters.js'
import EmptyState from './EmptyState.jsx'

export default function TemperatureChart({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return <EmptyState title="No trend data" message="Temperature trend will appear after a search." />
  }

  const data = forecast.map((d) => ({
    date: formatDate(d.date, { weekday: 'short' }),
    max: d.maxTemperature,
    min: d.minTemperature
  }))

  return (
    <section className="panel p-6" aria-label="Temperature trend">
      <h3 className="text-lg font-semibold mb-4">Temperature Trend</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="max" stroke="#F5A524" strokeWidth={2} dot={false} name="High" />
            <Line type="monotone" dataKey="min" stroke="#2AA9A0" strokeWidth={2} dot={false} name="Low" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
