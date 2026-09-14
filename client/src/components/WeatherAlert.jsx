import { AlertTriangle, ShieldCheck } from 'lucide-react'

export default function WeatherAlert({ alerts }) {
  const hasAlerts = alerts && alerts.length > 0

  return (
    <section className="panel p-5" aria-label="Weather alerts">
      {hasAlerts ? (
        <div className="flex flex-col gap-3">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 text-amber">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-ink dark:text-white">{alert.event}</p>
                <p className="text-sm text-mist">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 text-mist">
          <ShieldCheck size={20} />
          <p className="text-sm">No active weather alerts.</p>
        </div>
      )}
    </section>
  )
}
