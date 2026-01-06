import express from 'express';
import { companyRoutes } from '@/constants';
import { createCompany, getCompanyList,joinCompany } from '@/api/v1/controllers/company/company.controllers';

const router = express.Router();

router.post(companyRoutes.createCompany, createCompany);
router.post(companyRoutes.joinCompany, joinCompany);
router.get(companyRoutes.getCompanyList, getCompanyList);

export default router;