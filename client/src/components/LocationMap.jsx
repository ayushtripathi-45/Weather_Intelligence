import { useEffect, useState } from 'react'
import { getMapData } from '../services/mapService.js'
import LoadingSkeleton from './LoadingSkeleton.jsx'
import ErrorState from './ErrorState.jsx'

export default function LocationMap({ location }) {
  const [mapData, setMapData] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | error | ready

  useEffect(() => {
    if (!location?.name) return
    let cancelled = false

    setStatus('loading')
    getMapData(`${location.latitude},${location.longitude}`)
      .then((res) => {
        if (!cancelled) {
          setMapData(res.data)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [location])

  if (!location) return null

  if (status === 'loading') return <LoadingSkeleton lines={4} />
  if (status === 'error') {
    return <ErrorState message="Map is temporarily unavailable." />
  }

  const { latitude, longitude, name } = location
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.05}%2C${
    latitude - 0.05
  }%2C${longitude + 0.05}%2C${latitude + 0.05}&layer=mapnik&marker=${latitude}%2C${longitude}`

  return (
    <section className="panel p-6" aria-label="Location map">
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-sm text-mist font-mono tabular mb-4">
        Latitude: {latitude?.toFixed(4)} &nbsp; Longitude: {longitude?.toFixed(4)}
      </p>
      <div className="rounded-md overflow-hidden border border-slate-200 dark:border-white/10">
        <iframe
          title={`Map of ${name}`}
          src={embedSrc}
          width="100%"
          height="320"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>
      {mapData?.approximate && (
        <p className="text-xs text-mist mt-2">Showing an approximate location.</p>
      )}
    </section>
  )
}
