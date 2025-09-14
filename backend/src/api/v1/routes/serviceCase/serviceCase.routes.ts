import express from 'express'
import {
  getServiceCase
} from '@/api/v1/controllers/serviceCase/serviceCase.contoller'

const router = express.Router();

router.get('/getServiceCase', getServiceCase);

export default router;
