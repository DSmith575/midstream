import express from 'express';
import { createReferralForm, getUserReferrals } from '@/api/v1/controllers/referralForms/referralForms.controllers';

const router = express.Router();

router.post('/createReferralForm', createReferralForm);
router.get('/user/getReferralForm/:googleId', getUserReferrals)

export default router;