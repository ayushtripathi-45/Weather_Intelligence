import { useEffect, useState } from 'react'
import { PlayCircle } from 'lucide-react'
import { getLocationVideos } from '../services/youtubeService.js'
import LoadingSkeleton from './LoadingSkeleton.jsx'
import EmptyState from './EmptyState.jsx'

export default function YoutubeVideos({ location }) {
  const [videos, setVideos] = useState([])
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!location?.name) return
    let cancelled = false

    setStatus('loading')
    getLocationVideos(location.name)
      .then((res) => {
        if (!cancelled) {
          setVideos(res.data?.videos || [])
          setStatus('ready')
        }
      })
      .catch(() => {
        // YouTube is a non-critical integration: fail quietly so the
        // core weather experience keeps working.
        if (!cancelled) setStatus('unavailable')
      })

    return () => {
      cancelled = true
    }
  }, [location])

  if (!location) return null
  if (status === 'loading') return <LoadingSkeleton lines={3} />
  if (status === 'unavailable') {
    return <EmptyState title="Videos unavailable" message="We couldn't load videos right now, but your weather data is unaffected." />
  }
  if (status === 'ready' && videos.length === 0) {
    return <EmptyState title="No videos found" message={`We couldn't find videos for ${location.name}.`} />
  }

  return (
    <section aria-label="Explore this location on YouTube">
      <h3 className="text-lg font-semibold mb-4">Explore {location.name}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {videos.map((video) => (
          <a
            key={video.videoId}
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noreferrer"
            className="panel overflow-hidden group"
          >
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover"
              />
              <PlayCircle
                className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition"
                size={40}
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium line-clamp-2">{video.title}</p>
              <p className="text-xs text-mist mt-1">{video.channelTitle}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
