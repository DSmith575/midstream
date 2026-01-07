import express from 'express';
import { createReferralForm, getUserReferrals, getAllReferrals, getCaseWorkerReferrals, updateReferralChecklist, createReferralNote } from '@/api/v1/controllers/referralForms/referralForms.controllers';
import { generateFullReferralForm } from '@/api/v1/controllers/referralForms/referralFormFullForm.controllers';
import { authenticate, authenticateFlexible, authorizeUserAccess, authorizeStaffAccess } from '@/middleware/auth.middleware';
import { validateBody } from '@/middleware/validation.middleware';
import { createReferralFormSchema, createReferralNoteSchema, updateChecklistSchema } from '@/validation/schemas';
import { strictLimiter, uploadLimiter } from '@/middleware/rateLimit.middleware';

import { userReferralRoutes } from '@/constants';

const router = express.Router();

// Do not apply blanket authentication; use per-route auth so
// service calls can access specific endpoints via API key

// Create referral form - strict rate limit + validation + authorization
router.post(userReferralRoutes.createUserReferral, authenticate, strictLimiter, validateBody(createReferralFormSchema), authorizeUserAccess, createReferralForm);

// Get user's own referrals - verify user can only access their own data
router.get(userReferralRoutes.getUserReferrals, authenticate, authorizeUserAccess, getUserReferrals);

// Generate PDF - rate limited
router.post(userReferralRoutes.generateUserFullForm, authenticate, uploadLimiter, generateFullReferralForm);

// Staff-only endpoints
router.get(userReferralRoutes.getAllReferrals, authenticate, authorizeStaffAccess, getAllReferrals);
router.get(userReferralRoutes.getCaseWorkerReferrals, authenticate, authorizeStaffAccess, getCaseWorkerReferrals);

// Service endpoints (Python API) - allow service authentication
router.patch(userReferralRoutes.updateReferralChecklist, authenticateFlexible, validateBody(updateChecklistSchema), updateReferralChecklist);
router.post(userReferralRoutes.createReferralNote, authenticateFlexible, validateBody(createReferralNoteSchema), createReferralNote);

export default router;