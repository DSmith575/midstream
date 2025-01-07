import express, { Request, Response } from 'express';
import cors from 'cors';
import userProfileRouter from '@/api/v1/routes/userProfiles/userProfiles.routes';

const app = express();
const port = process.env.PORT || 3000;

const CURRENT_VERSION = 'v1';
const API_BASE_URL = `/api/${CURRENT_VERSION}`;

app.use(express.json());
app.use(cors());

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, TypeScript Express!');
// });

app.use(`${API_BASE_URL}/userProfiles`, userProfileRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;