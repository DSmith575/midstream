import express from "express";
import { updateReferralForm } from "@/api/v1/controllers/assignCases/assignCases.controller";

const router = express.Router();

router.post("/assignWorker", updateReferralForm);

export default router;