import express from 'express';
import { getAnalytics } from '@/api/v1/controllers/analytics/analytics.controllers';

const router = express.Router();

router.get('/getAnalytics', getAnalytics);

export default router;