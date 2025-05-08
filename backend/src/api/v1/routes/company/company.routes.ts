import express from 'express';
import { createCompany, getCompanyList,joinCompany } from '@/api/v1/controllers/company/company.controllers';

const router = express.Router();

router.post('/createCompany', createCompany);
router.post('/joinCompany', joinCompany);
router.get('/getCompanyList', getCompanyList);

export default router;