import express from 'express';
import cors from 'cors';
import userProfileRouter from '@/api/v1/routes/userProfiles/userProfiles.routes';
import analyticsRouter from '@/api/v1/routes/analytics/analytics.routes';
import referralFormRouter from '@/api/v1/routes/referralForms/referralForms.routes';
import clerkRouter from '@/api/v1/routes/clerk/clerk.routes';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';
import assignCasesRouter from '@/api/v1/routes/assignCases/assignCases.routes';


dotenv.config();
const app = express();
const port = process.env.PORT || 3001;


const CURRENT_VERSION = 'v1';
const API_BASE_URL = `/api/${CURRENT_VERSION}`;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY, // Use the Clerk Publishable Key
}));

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, TypeScript Express!');
// });

app.use(`${API_BASE_URL}/userProfiles`, userProfileRouter);
app.use(`${API_BASE_URL}/analytics`, analyticsRouter);
app.use(`${API_BASE_URL}/referralForms`, referralFormRouter);
app.use(`${API_BASE_URL}/clerk`, clerkRouter);
app.use(`${API_BASE_URL}/assignCases`, assignCasesRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;