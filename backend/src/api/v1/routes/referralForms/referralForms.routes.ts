import express from 'express';
import { createReferralForm, getUserReferrals, getAllReferrals, getCaseWorkerReferrals, updateReferralChecklist, createReferralNote } from '@/api/v1/controllers/referralForms/referralForms.controllers';
import { generateFullReferralForm } from '@/api/v1/controllers/referralForms/referralFormFullForm.controllers';
import { authenticate, authorizeUserAccess, authorizeStaffAccess } from '@/middleware/auth.middleware';
import { validateBody } from '@/middleware/validation.middleware';
import { createReferralFormSchema, createReferralNoteSchema, updateChecklistSchema } from '@/validation/schemas';
import { strictLimiter, uploadLimiter } from '@/middleware/rateLimit.middleware';

import { userReferralRoutes } from '@/constants';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Create referral form - strict rate limit + validation + authorization
router.post(userReferralRoutes.createUserReferral, strictLimiter, validateBody(createReferralFormSchema), authorizeUserAccess, createReferralForm);

// Get user's own referrals - verify user can only access their own data
router.get(userReferralRoutes.getUserReferrals, authorizeUserAccess, getUserReferrals);

// Generate PDF - rate limited
router.post(userReferralRoutes.generateUserFullForm, uploadLimiter, generateFullReferralForm);

// Staff-only endpoints
router.get(userReferralRoutes.getAllReferrals, authorizeStaffAccess, getAllReferrals);
router.get(userReferralRoutes.getCaseWorkerReferrals, authorizeStaffAccess, getCaseWorkerReferrals);
// Update checklist - validation required
router.patch(userReferralRoutes.updateReferralChecklist, validateBody(updateChecklistSchema), updateReferralChecklist);

// Create note - validation required
router.post(userReferralRoutes.createReferralNote, validateBody(createReferralNoteSchema), createReferralNote);

export default router;