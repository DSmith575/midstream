# Security Implementation Guide

## 🔒 Security Improvements Implemented

This document outlines the security measures implemented to protect user data and ensure secure API operations.

---

## 1. Authentication & Authorization

### Authentication Middleware
All API routes now require authentication using Clerk's `requireAuth()` middleware.

**Location:** `src/middleware/auth.middleware.ts`

**Features:**
- ✅ Blocks all unauthenticated requests
- ✅ Validates Clerk session tokens
- ✅ Extracts authenticated user ID

### Authorization Middleware

#### `authorizeUserAccess`
Ensures users can **only access their own data**.

**Usage:**
```typescript
router.get('/getUserProfile', authorizeUserAccess, getUserProfile);
```

**How it works:**
1. Extracts authenticated user ID from Clerk session
2. Compares with requested `googleId` from query/params/body
3. Returns 403 Forbidden if IDs don't match

#### `authorizeStaffAccess`
Restricts access to admin/caseworker-only endpoints.

**Usage:**
```typescript
router.get('/getAllReferralForms/:companyId', authorizeStaffAccess, getAllReferrals);
```

---

## 2. Input Validation

All request data is validated using **Zod schemas** before processing.

**Location:** `src/validation/schemas.ts`

### Schemas Available:
- `createUserProfileSchema` - User profile creation
- `createReferralFormSchema` - Referral form submission
- `createReferralNoteSchema` - Note creation
- `updateChecklistSchema` - Checklist updates

### Usage Example:
```typescript
router.post('/createUserProfile', 
  validateBody(createUserProfileSchema), 
  createUserProfile
);
```

**Benefits:**
- ✅ Prevents SQL injection
- ✅ Validates data types and formats
- ✅ Enforces max lengths to prevent buffer overflow
- ✅ Returns clear validation error messages

---

## 3. Rate Limiting

Three levels of rate limiting protect against abuse and DoS attacks.

**Location:** `src/middleware/rateLimit.middleware.ts`

### Rate Limiters:

#### `apiLimiter` (General)
- **Limit:** 100 requests per 15 minutes per IP
- **Applied to:** All API routes

#### `strictLimiter` (Sensitive Operations)
- **Limit:** 10 requests per 15 minutes per IP
- **Applied to:** User creation, profile updates

#### `uploadLimiter` (File Uploads)
- **Limit:** 20 uploads per hour per IP
- **Applied to:** PDF generation, audio uploads

---

## 4. Secure Error Handling

### Before:
```typescript
catch (error) {
  console.error(error); // Logs sensitive data
  return res.status(500).json({ message: error.message }); // Exposes internal errors
}
```

### After:
```typescript
catch (error) {
  return res.status(500).json({ message: "Failed to retrieve user profile" });
}
```

**Improvements:**
- ✅ Removed `console.log()` exposing user data
- ✅ Generic error messages prevent information leakage
- ✅ Sensitive stack traces hidden from client

---

## 5. Protected Routes

### User Profile Routes
```typescript
// Authentication + Authorization + Validation + Rate Limiting
router.post('/createUserProfile', 
  authenticate,
  strictLimiter, 
  validateBody(createUserProfileSchema), 
  authorizeUserAccess, 
  createUserProfile
);

router.get('/getUserProfile', 
  authenticate,
  authorizeUserAccess, 
  getUserProfile
);
```

### Referral Form Routes
```typescript
// User can only create their own referrals
router.post('/createReferralForm', 
  authenticate,
  strictLimiter, 
  validateBody(createReferralFormSchema), 
  authorizeUserAccess, 
  createReferralForm
);

// User can only view their own referrals
router.get('/user/getReferralForm/:googleId', 
  authenticate,
  authorizeUserAccess, 
  getUserReferrals
);

// Staff-only access
router.get('/getAllReferralForms/:companyId', 
  authenticate,
  authorizeStaffAccess, 
  getAllReferrals
);
```

---

## 6. Security Checklist

### ✅ Completed
- [x] Authentication on all routes
- [x] Authorization checks (user can only access own data)
- [x] Input validation with Zod
- [x] Rate limiting (3 tiers)
- [x] Removed console.log exposing user data
- [x] Sanitized error responses
- [x] Secure middleware architecture

### 🔄 Recommended Next Steps
- [ ] Implement role-based access control (RBAC) with Clerk
- [ ] Add request logging (without sensitive data)
- [ ] Implement CORS whitelist for production
- [ ] Add helmet.js for additional HTTP headers security
- [ ] Set up API key rotation for Clerk
- [ ] Implement audit logging for sensitive operations
- [ ] Add data encryption at rest for sensitive fields
- [ ] Set up monitoring and alerting for suspicious activity

---

## 7. Testing Security

### Test Authentication:
```bash
# Should return 401 Unauthorized
curl http://localhost:3001/api/v1/userProfiles/getUserProfile?googleId=test123
```

### Test Authorization:
```bash
# Authenticated as user A trying to access user B's data
# Should return 403 Forbidden
curl -H "Authorization: Bearer <user_A_token>" \
  http://localhost:3001/api/v1/userProfiles/getUserProfile?googleId=user_B_id
```

### Test Rate Limiting:
```bash
# Send 101 requests rapidly
# Should return 429 Too Many Requests after 100
for i in {1..101}; do
  curl http://localhost:3001/api/v1/userProfiles/getUserProfile?googleId=test
done
```

---

## 8. Environment Variables

Ensure these are set in your `.env` file:

```env
CLERK_SECRET_KEY=your_clerk_secret_key_here
PORT=3001
DATABASE_URL=your_database_url_here
```

**Never commit `.env` to version control!**

---

## 9. CORS Configuration

Currently using permissive CORS. For production, update to:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g., 'https://yourdomain.com'
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Support

For security concerns or to report vulnerabilities, please contact your security team immediately.

**Last Updated:** January 7, 2026
