import express from 'express';
import cors from 'cors';
import userProfileRouter from '@/api/v1/routes/userProfiles/userProfiles.routes';
import analyticsRouter from '@/api/v1/routes/analytics/analytics.routes';
import referralFormRouter from '@/api/v1/routes/referralForms/referralForms.routes';
// import clerkRouter from '@/api/v1/routes/clerk/clerk.routes';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';
import assignCasesRouter from '@/api/v1/routes/assignCases/assignCases.routes';
import companyRouter from '@/api/v1/routes/company/company.routes';
import devRouter from '@/api/v1/routes/devTools/userRoles.routes';
import documentRouter from '@/api/v1/routes/audioDocuments/audioDocuments.routes';
import serviceCaseRouter from '@/api/v1/routes/serviceCase/serviceCase.routes';
import servicePlanRouter from '@/api/v1/routes/servicePlan/servicePlan.routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

const CURRENT_VERSION = 'v1';
const API_BASE_URL = `/api/${CURRENT_VERSION}`;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
}));

app.use(`${API_BASE_URL}/userProfiles`, userProfileRouter);
app.use(`${API_BASE_URL}/analytics`, analyticsRouter);
app.use(`${API_BASE_URL}/referralForms`, referralFormRouter);
// app.use(`${API_BASE_URL}/clerk`, clerkRouter);
app.use(`${API_BASE_URL}/assignCases`, assignCasesRouter);
app.use(`${API_BASE_URL}/company`, companyRouter);
app.use(`${API_BASE_URL}/devTools`, devRouter);
app.use(`${API_BASE_URL}/referral-documents`, documentRouter);

app.use(`${API_BASE_URL}/serviceCase`, serviceCaseRouter);
app.use(`${API_BASE_URL}/servicePlan`, servicePlanRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;