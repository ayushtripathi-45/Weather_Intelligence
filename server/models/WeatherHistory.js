import mongoose from 'mongoose'

const { Schema } = mongoose

const ForecastDaySchema = new Schema(
  {
    date: { type: Date, required: true },
    minTemperature: Number,
    maxTemperature: Number,
    condition: String,
    icon: String,
    precipitationProbability: Number
  },
  { _id: false }
)

const WeatherHistorySchema = new Schema(
  {
    location: {
      name: { type: String, required: true, trim: true },
      country: String,
      state: String,
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },

    requestedDateRange: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true }
    },

    weather: {
      temperature: Number,
      feelsLike: Number,
      humidity: Number,
      pressure: Number,
      windSpeed: Number,
      windDirection: String,
      visibility: Number,
      cloudCoverage: Number,
      uvIndex: Number,
      condition: String,
      icon: String,
      sunrise: Date,
      sunset: Date
    },

    forecast: [ForecastDaySchema],

    source: { type: String, default: 'OpenWeatherMap' }
  },
  { timestamps: true }
)

WeatherHistorySchema.pre('validate', function validateRange(next) {
  if (this.requestedDateRange?.startDate && this.requestedDateRange?.endDate) {
    if (this.requestedDateRange.startDate > this.requestedDateRange.endDate) {
      return next(new Error('Start date cannot be after the end date.'))
    }
  }
  next()
})

WeatherHistorySchema.index({ 'location.name': 'text' })

export default mongoose.model('WeatherHistory', WeatherHistorySchema)
