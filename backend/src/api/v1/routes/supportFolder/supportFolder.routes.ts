import express from 'express';
import multer from 'multer';
import {
  createSupportFolderTextItem,
  deleteSupportFolderItem,
  downloadSupportFolderItem,
  getSupportFolderItems,
  uploadSupportFolderFile,
} from '@/api/v1/controllers/supportFolder/supportFolder.controller';
import { authenticate, authorizeUserAccess } from '@/middleware/auth.middleware';
import { uploadLimiter } from '@/middleware/rateLimit.middleware';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

router.use(authenticate);

router.get('/:googleId/items', authorizeUserAccess, getSupportFolderItems);
router.post('/:googleId/text', authorizeUserAccess, createSupportFolderTextItem);
router.post('/:googleId/upload', authorizeUserAccess, uploadLimiter, upload.single('file'), uploadSupportFolderFile);
router.get('/:googleId/items/:itemId/download', authorizeUserAccess, downloadSupportFolderItem);
router.delete('/:googleId/items/:itemId', authorizeUserAccess, deleteSupportFolderItem);

export default router;
