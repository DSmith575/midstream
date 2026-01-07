import express from "express";
import { createAudioDocumentReferralHandler, updateDocumentTranscribedContent } from "@/api/v1/controllers/audioDocuments/audioDocuments.controller";

const router = express.Router();

router.post("/upload-audio", createAudioDocumentReferralHandler);
router.put("/document/:documentId", updateDocumentTranscribedContent);

export default router;