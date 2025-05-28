import express from 'express'
import { createDestination, deleteDestination, getDestination, updateDestination,getAllDestination } from '../controllers/destination-controller.js'

const router =express.Router()

router.post('/create',createDestination)

router.get('/',getAllDestination)

router.get('/:account_id',getDestination)

router.route('/:id').put(updateDestination).delete(deleteDestination)


export default router