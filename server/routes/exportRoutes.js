import { Router } from 'express'
import { exportJSON, exportCSV, exportPDF } from '../controllers/exportController.js'

const router = Router()

router.get('/json', exportJSON)
router.get('/csv', exportCSV)
router.get('/pdf', exportPDF)

export default router
