import express from 'express'
import {handleIncomingData} from '../controllers/incoming-data-controller.js'
import { incomingLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/incoming_data',incomingLimiter,handleIncomingData)

export default router