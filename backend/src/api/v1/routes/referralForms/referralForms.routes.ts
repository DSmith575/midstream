import express from 'express';
import { createReferralForm, getUserReferrals, getAllReferrals } from '@/api/v1/controllers/referralForms/referralForms.controllers';

const router = express.Router();

router.post('/createReferralForm', createReferralForm);
router.get('/user/getReferralForm/:googleId', getUserReferrals)
router.get('/getAllReferralForms', getAllReferrals);

export default router;