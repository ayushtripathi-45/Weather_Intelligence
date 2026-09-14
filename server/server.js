import app from './app.js'
import connectDB from './config/db.js'
import { env } from './config/env.js'

async function start() {
  await connectDB()

  const server = app.listen(env.port, () => {
    console.log(`Weather Intelligence API listening on port ${env.port} [${env.nodeEnv}]`)
  })

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err)
    server.close(() => process.exit(1))
  })
}

start()
