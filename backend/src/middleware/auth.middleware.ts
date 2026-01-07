import { Request, Response, NextFunction } from 'express';
import { requireAuth, getAuth } from '@clerk/express';

/**
 * Middleware to authenticate service-to-service requests
 * Checks for SERVICE_API_KEY in x-api-key header
 */
export const authenticateService = (req: Request, res: Response, next: NextFunction): any => {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.SERVICE_API_KEY;

  if (!expectedApiKey) {
    console.error('SERVICE_API_KEY not configured');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  if (apiKey === expectedApiKey) {
    // Mark request as service-authenticated
    (req as any).isServiceAuth = true;
    return next();
  }

  return res.status(401).json({ message: 'Invalid service API key' });
};

/**
 * Middleware to require authentication using Clerk or service API key
 * Allows both user authentication and service-to-service calls
 */
export const authenticateFlexible = (req: Request, res: Response, next: NextFunction): any => {
  // Check for service API key first
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.SERVICE_API_KEY;

  if (apiKey && expectedApiKey && apiKey === expectedApiKey) {
    (req as any).isServiceAuth = true;
    return next();
  }

  // Fall back to Clerk authentication
  return requireAuth()(req, res, next);
};

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
