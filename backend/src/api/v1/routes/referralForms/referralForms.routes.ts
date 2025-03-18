import express from 'express';
import { createReferralForm } from '@/api/v1/controllers/referralForms/referralForms.controllers';

const router = express.Router();

router.post('/createReferralForm', createReferralForm);

export default router;