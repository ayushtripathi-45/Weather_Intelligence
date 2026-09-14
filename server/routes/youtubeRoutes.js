import { Router } from 'express'
import { getVideos } from '../controllers/youtubeController.js'

const router = Router()

router.get('/', getVideos)

export default router
