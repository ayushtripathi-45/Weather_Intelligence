import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'

import weatherRoutes from './routes/weatherRoutes.js'
import historyRoutes from './routes/historyRoutes.js'
import locationRoutes from './routes/locationRoutes.js'
import youtubeRoutes from './routes/youtubeRoutes.js'
import exportRoutes from './routes/exportRoutes.js'

import notFound from './middleware/notFound.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
)
app.use(express.json())
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'))

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Weather Intelligence API is running' })
})

app.use('/api/weather/history', historyRoutes)
app.use('/api/weather', weatherRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/youtube', youtubeRoutes)
app.use('/api/export', exportRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
