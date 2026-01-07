import express from "express";
import { createAudioDocumentReferralHandler, updateDocumentTranscribedContent } from "@/api/v1/controllers/audioDocuments/audioDocuments.controller";
import { authenticateFlexible } from "@/middleware/auth.middleware";

const router = express.Router();

// Allow either Clerk user auth or service API key auth
router.post("/upload-audio", authenticateFlexible, createAudioDocumentReferralHandler);
router.put("/document/:documentId", authenticateFlexible, updateDocumentTranscribedContent);

export default router;