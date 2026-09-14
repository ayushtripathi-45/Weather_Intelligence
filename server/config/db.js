import mongoose from 'mongoose'

export default async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('MONGODB_URI is not set. Add it to server/.env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.')
  })
}
