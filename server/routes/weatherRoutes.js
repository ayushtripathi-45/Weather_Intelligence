import { Router } from 'express'
import { getCurrent, getForecast, getByCoordinates } from '../controllers/weatherController.js'
import { validateLocationQuery, validateCoordinatesQuery } from '../middleware/validateWeatherQuery.js'

const router = Router()

router.get('/current', validateLocationQuery, getCurrent)
router.get('/forecast', validateLocationQuery, getForecast)
router.get('/coordinates', validateCoordinatesQuery, getByCoordinates)

export default router
