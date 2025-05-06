import express from 'express';
import { createMembershipInvite } from '@/api/v1/controllers/clerk/clerkMembership.controller';

const router = express.Router();

router.post('/createMembershipInvite', createMembershipInvite);

export default router;

