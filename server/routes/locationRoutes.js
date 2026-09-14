import { Router } from 'express'
import { search, map } from '../controllers/locationController.js'

const router = Router()

router.get('/search', search)
router.get('/map', map)

export default router
