import express from 'express'
import { createAccount,deleteAccount,getAccount, getAllAccounts, updateAccount } from '../controllers/account-controller.js'

const router = express.Router()

router.post('/create',createAccount)

router.get('/',getAllAccounts)

router.route('/:account_id').get(getAccount).put(updateAccount).delete(deleteAccount)

export default router

