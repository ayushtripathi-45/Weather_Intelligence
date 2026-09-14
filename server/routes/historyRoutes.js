import { Router } from 'express'
import {
  createRecord,
  listRecords,
  getRecord,
  updateRecord,
  deleteRecord
} from '../controllers/historyController.js'
import { validateHistoryInput, validateObjectId } from '../middleware/validateHistoryInput.js'

const router = Router()

router.post('/', validateHistoryInput, createRecord)
router.get('/', listRecords)
router.get('/:id', validateObjectId, getRecord)
router.put('/:id', validateObjectId, validateHistoryInput, updateRecord)
router.delete('/:id', validateObjectId, deleteRecord)

export default router
