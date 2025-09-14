import express from "express";
import { createAudioDocumentReferralHandler } from "@/api/v1/controllers/audioDocuments/audioDocuments.controller";

const router = express.Router();

router.post("/upload-audio", createAudioDocumentReferralHandler);

export default router;