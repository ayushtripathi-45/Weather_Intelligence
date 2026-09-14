import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI,
  weatherApiKey: process.env.WEATHER_API_KEY,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development'
}
