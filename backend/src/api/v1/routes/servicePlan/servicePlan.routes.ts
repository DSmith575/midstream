import express from 'express'
import {
  createServicePlan,
  createServicePlanEntry,
  createServicePlanEntryComment,
  deleteServicePlanEntry,
  deleteServicePlanEntryComment,
  getServiceCategories,
  getServicePlan,
} from '@/api/v1/controllers/servicePlan'

const router = express.Router();

router.post('/createServicePlan', createServicePlan);
router.post('/createServicePlanEntry', createServicePlanEntry);
router.post('/createServicePlanEntryComment', createServicePlanEntryComment);
router.delete('/deleteServicePlanEntry/:servicePlanEntryId', deleteServicePlanEntry);
router.delete('/deleteServicePlanEntryComment/:servicePlanEntryCommentId', deleteServicePlanEntryComment);
router.get('/getServiceCategories', getServiceCategories);
router.get('/getServicePlan/:servicePlanId', getServicePlan);

export default router;