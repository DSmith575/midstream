import express from 'express';
import multer from 'multer';
import {
  createSupportFolderTextItem,
  deleteSupportFolderItem,
  downloadSupportFolderItem,
  getSupportFolderItems,
  getUpcomingSupportNotifications,
  moveUpcomingSupportToUpcoming,
  updateUpcomingSupportDueDate,
  updateUpcomingSupportDismissStatus,
  updateUpcomingSupportReadStatus,
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
router.get('/:googleId/upcoming-support', authorizeUserAccess, getUpcomingSupportNotifications);
router.patch('/:googleId/upcoming-support/:notificationId/read', authorizeUserAccess, updateUpcomingSupportReadStatus);
router.patch('/:googleId/upcoming-support/:notificationId/dismiss', authorizeUserAccess, updateUpcomingSupportDismissStatus);
router.patch('/:googleId/upcoming-support/:notificationId/due-date', authorizeUserAccess, updateUpcomingSupportDueDate);
router.patch('/:googleId/upcoming-support/:notificationId/move-to-upcoming', authorizeUserAccess, moveUpcomingSupportToUpcoming);
router.post('/:googleId/text', authorizeUserAccess, createSupportFolderTextItem);
router.post('/:googleId/upload', authorizeUserAccess, uploadLimiter, upload.single('file'), uploadSupportFolderFile);
router.get('/:googleId/items/:itemId/download', authorizeUserAccess, downloadSupportFolderItem);
router.delete('/:googleId/items/:itemId', authorizeUserAccess, deleteSupportFolderItem);

export default router;
