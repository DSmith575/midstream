import express from 'express'
import { updateUserRole } from '@/api/v1/controllers/devTools/userRoles.controller'

const router = express.Router()

router.post('/updateUserRole', updateUserRole)

export default router