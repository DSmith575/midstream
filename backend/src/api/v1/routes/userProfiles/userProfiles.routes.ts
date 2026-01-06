import express from 'express';
import { createUserProfile, getUserProfile } from '@/api/v1/controllers/userProfiles/userProfiles.controllers';
import { authenticate, authorizeUserAccess } from '@/middleware/auth.middleware';
import { validateBody } from '@/middleware/validation.middleware';
import { createUserProfileSchema } from '@/validation/schemas';
import { strictLimiter } from '@/middleware/rateLimit.middleware';
import { userProfileRoutes } from '@/constants';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Create user profile - strict rate limit + validation
router.post(userProfileRoutes.createUserProfile, strictLimiter, validateBody(createUserProfileSchema), authorizeUserAccess, createUserProfile);

// Get user profile - verify user can only access their own profile
router.get(userProfileRoutes.getUserProfile, authorizeUserAccess, getUserProfile);

export default router;