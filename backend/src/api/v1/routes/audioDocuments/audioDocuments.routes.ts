import express from "express";
import { createAudioDocumentReferralHandler, updateDocumentTranscribedContent } from "@/api/v1/controllers/audioDocuments/audioDocuments.controller";
import { authenticate, authenticateFlexible } from "@/middleware/auth.middleware";

const router = express.Router();

// Service endpoint - Python API uses service API key
router.post("/upload-audio", authenticateFlexible, createAudioDocumentReferralHandler);

// User endpoint - Frontend uses Clerk auth
router.put("/document/:documentId", authenticate, updateDocumentTranscribedContent);

export default router;