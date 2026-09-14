import axios from 'axios'
import AppError from '../utils/AppError.js'
import { env } from '../config/env.js'

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

/**
 * YouTube is a non-critical, "nice to have" integration. Callers
 * (the /api/youtube route) catch failures here and still return
 * a 200-friendly empty list rather than breaking the whole page.
 */
export async function searchLocationVideos(location) {
  if (!env.youtubeApiKey) {
    throw new AppError('YouTube service is not configured (missing YOUTUBE_API_KEY).', 503, 'SERVICE_UNAVAILABLE')
  }

  const { data } = await axios.get(YOUTUBE_SEARCH_URL, {
    params: {
      part: 'snippet',
      q: `${location} travel tourism`,
      type: 'video',
      maxResults: 6,
      key: env.youtubeApiKey
    },
    timeout: 8000
  })

  return (data.items || []).map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
  }))
}
