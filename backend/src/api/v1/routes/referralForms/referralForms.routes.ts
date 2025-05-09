import express from 'express';
import { createReferralForm, getUserReferrals, getAllReferrals, getCaseWorkerReferrals } from '@/api/v1/controllers/referralForms/referralForms.controllers';

const router = express.Router();

router.post('/createReferralForm', createReferralForm);
router.get('/user/getReferralForm/:googleId', getUserReferrals)
router.get('/getAllReferralForms/:companyId', getAllReferrals);
router.get('/caseWorker/getReferralForm/:googleId', getCaseWorkerReferrals);

export default router;