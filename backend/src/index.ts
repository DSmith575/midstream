import express from 'express';
import cors from 'cors';
import userProfileRouter from '@/api/v1/routes/userProfiles/userProfiles.routes';
import analyticsRouter from '@/api/v1/routes/analytics/analytics.routes';
import referralFormRouter from '@/api/v1/routes/referralForms/referralForms.routes';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';
import assignCasesRouter from '@/api/v1/routes/assignCases/assignCases.routes';
import companyRouter from '@/api/v1/routes/company/company.routes';
import devRouter from '@/api/v1/routes/devTools/userRoles.routes';
import documentRouter from '@/api/v1/routes/audioDocuments/audioDocuments.routes';
import serviceCaseRouter from '@/api/v1/routes/serviceCase/serviceCase.routes';
import servicePlanRouter from '@/api/v1/routes/servicePlan/servicePlan.routes';
import { apiLimiter } from '@/middleware/rateLimit.middleware';
import { endPointRoutes } from '@/constants';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

const CURRENT_VERSION = 'v1';
const API_BASE_URL = `/api/${CURRENT_VERSION}`;

app.use(express.json());
app.use(cors());

// Trust the first proxy (Render/hosting) so rate limiters and auth can
// correctly use X-Forwarded-For to identify client IPs
app.set('trust proxy', 1);

// Apply rate limiting to all API routes
app.use(API_BASE_URL, apiLimiter);

// Clerk authentication middleware
app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
}));

app.use(`${API_BASE_URL}${endPointRoutes.userProfile}`, userProfileRouter);
app.use(`${API_BASE_URL}${endPointRoutes.analytics}`, analyticsRouter);
app.use(`${API_BASE_URL}${endPointRoutes.referralForms}`, referralFormRouter);
// app.use(`${API_BASE_URL}/clerk`, clerkRouter);
app.use(`${API_BASE_URL}${endPointRoutes.assignCases}`, assignCasesRouter);
app.use(`${API_BASE_URL}${endPointRoutes.company}`, companyRouter);
app.use(`${API_BASE_URL}${endPointRoutes.devTools}`, devRouter);
app.use(`${API_BASE_URL}${endPointRoutes.referralDocuments}`, documentRouter);

app.use(`${API_BASE_URL}${endPointRoutes.serviceCase}`, serviceCaseRouter);
app.use(`${API_BASE_URL}${endPointRoutes.servicePlan}`, servicePlanRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;