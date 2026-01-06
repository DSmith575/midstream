import express from "express";
import { audioDocumentRoutes } from "@/constants";
import { createAudioDocumentReferralHandler, updateDocumentTranscribedContent } from "@/api/v1/controllers/audioDocuments/audioDocuments.controller";

const router = express.Router();

router.post(audioDocumentRoutes.uploadAudioDocument, createAudioDocumentReferralHandler);
router.put(audioDocumentRoutes.updateUserAudioDocuments, updateDocumentTranscribedContent);

export default router;