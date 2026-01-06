import { Request, Response, NextFunction } from 'express';
import { requireAuth, getAuth } from '@clerk/express';

/**
 * Middleware to require authentication using Clerk
 * Blocks unauthenticated requests
 */
export const authenticate = requireAuth();

/**
 * Middleware to verify user can only access their own data
 * Compares the authenticated userId with the requested googleId
 */
export const authorizeUserAccess = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const auth = getAuth(req);
    
    if (!auth?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check googleId from query, params, or body
    const requestedUserId = req.query.googleId || req.params.googleId || req.body.googleId;
    
    if (!requestedUserId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Verify the authenticated user matches the requested user
    if (auth.userId !== requestedUserId) {
      return res.status(403).json({ message: 'Forbidden: You can only access your own data' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authorization check failed' });
  }
};

/**
 * Middleware to verify admin/caseworker role
 * Use for endpoints that should only be accessible to staff
 */
export const authorizeStaffAccess = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const auth = getAuth(req);
    
    if (!auth?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // You can add role checks here once roles are implemented in Clerk
    // For now, just verify authentication
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authorization check failed' });
  }
};
