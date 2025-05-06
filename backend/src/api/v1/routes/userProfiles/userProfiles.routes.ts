import express from 'express';
import { createUserProfile, getUserProfile } from '@/api/v1/controllers/userProfiles/userProfiles.controllers';

const router = express.Router();

router.post('/createUserProfile', createUserProfile);
router.get('/getUserProfile', getUserProfile);

export default router;