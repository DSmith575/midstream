import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { statusCodes } from '@/constants';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const PYTHON_API_URL = process.env.PYTHON_API_KEY || process.env.PYTHON_API_URL;
const MAX_ANALYSIS_ITEMS = 20;
const MAX_ANALYSIS_FILE_BYTES = 15 * 1024 * 1024;
const DEFAULT_CONFIDENCE = 0.6;

const sendError = (res: Response, status: number, message: string) => {
  return res.status(status).json({ message });
};

const findUserByGoogleId = async (googleId: string) => {
  return prisma.user.findUnique({
    where: { googleId: String(googleId) },
  });
};

const parseSupportType = (mimeType?: string | null): 'FILE' | 'AUDIO' => {
  if (!mimeType) return 'FILE';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  return 'FILE';
};

const normalizeBaseUrl = (url: string) => {
  return url.endsWith('/') ? url : `${url}/`;
};

const isAnalyzableMimeType = (mimeType?: string | null) => {
  if (!mimeType) return false;
  return (
    mimeType.startsWith('text/') ||
    mimeType === 'application/pdf' ||
    mimeType.startsWith('image/')
  );
};

const safeUtf8FromBuffer = (data?: Buffer | Uint8Array | null) => {
  if (!data) return null;
  try {
    const text = Buffer.from(data).toString('utf8').trim();
    return text.length > 0 ? text : null;
  } catch {
    return null;
  }
};

const supportFolderItemModel = (prisma as any).supportFolderItem;
const upcomingSupportNotificationModel = (prisma as any).upcomingSupportNotification;

type UpcomingSupportRecord = {
  id: string;
  title: string;
  summary: string;
  dueDateISO: Date | null;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  sourceItemId: string | null;
  sourceItemName: string | null;
  reason: string | null;
  isRead: boolean;
  isDismissed: boolean;
  scannedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const normalizeUrgency = (value: unknown): 'LOW' | 'MEDIUM' | 'HIGH' => {
  const normalized = String(value || '').toUpperCase();
  if (normalized === 'LOW' || normalized === 'MEDIUM' || normalized === 'HIGH') {
    return normalized;
  }
  return 'MEDIUM';
};

const normalizeConfidence = (value: unknown): number => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return DEFAULT_CONFIDENCE;
  return Math.max(0, Math.min(1, parsed));
};

const parseDueDate = (value: unknown): Date | null => {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const MONTH_NUMBER_BY_NAME: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const MONTH_NAMES_PATTERN =
  'january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec';

const normalizeMonthName = (value: string): string => {
  const normalized = value.trim().toLowerCase();
  const aliases: Record<string, string> = {
    jan: 'january',
    feb: 'february',
    mar: 'march',
    apr: 'april',
    jun: 'june',
    jul: 'july',
    aug: 'august',
    sep: 'september',
    sept: 'september',
    oct: 'october',
    nov: 'november',
    dec: 'december',
  };
  return aliases[normalized] || normalized;
};

const inferDueDateFromVoiceTranscript = (transcript: string, now: Date): Date | null => {
  const text = transcript.trim();
  if (!text) return null;

  const dayMonthPattern = new RegExp(
    `\\b(?<day>\\d{1,2})(?:st|nd|rd|th)?\\s*(?:of\\s+)?(?<month>${MONTH_NAMES_PATTERN})\\b(?:\\s*(?:,|of)?\\s*(?<year>\\d{4}))?(?:[^\\n]*?\\bat\\s+(?<hour>\\d{1,2})(?::(?<minute>\\d{2}))?\\s*(?<ampm>am|pm))?`,
    'i',
  );
  const monthDayPattern = new RegExp(
    `\\b(?<month>${MONTH_NAMES_PATTERN})\\s+(?<day>\\d{1,2})(?:st|nd|rd|th)?\\b(?:\\s*,?\\s*(?<year>\\d{4}))?(?:[^\\n]*?\\bat\\s+(?<hour>\\d{1,2})(?::(?<minute>\\d{2}))?\\s*(?<ampm>am|pm))?`,
    'i',
  );

  const match = dayMonthPattern.exec(text) || monthDayPattern.exec(text);
  if (!match?.groups) return null;

  const day = Number(match.groups.day);
  const monthKey = normalizeMonthName(match.groups.month || '');
  const month = MONTH_NUMBER_BY_NAME[monthKey];
  if (!month || Number.isNaN(day) || day < 1 || day > 31) return null;

  const explicitYear = Number(match.groups.year);
  const hasYear = !Number.isNaN(explicitYear) && explicitYear >= 1900;
  let year = hasYear ? explicitYear : now.getUTCFullYear();

  let hour = 9;
  let minute = 0;
  if (match.groups.hour) {
    hour = Number(match.groups.hour);
    minute = Number(match.groups.minute || 0);
    const ampm = String(match.groups.ampm || '').toLowerCase();
    if (ampm === 'pm' && hour !== 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;
  }

  const candidate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
  if (!hasYear && candidate.getTime() < now.getTime()) {
    year += 1;
    return new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
  }

  return candidate;
};

const createFingerprint = (item: any): string => {
  const sourceItemId = String(item?.sourceItemId || '').trim();
  const title = String(item?.title || '').trim().toLowerCase();
  const dueKey = String(item?.dueDateISO || '').trim();
  return `${sourceItemId}|${title}|${dueKey}`;
};

const serializeNotification = (row: UpcomingSupportRecord) => ({
  id: row.id,
  title: row.title,
  summary: row.summary,
  dueDateISO: row.dueDateISO ? row.dueDateISO.toISOString() : null,
  urgency: row.urgency,
  confidence: row.confidence,
  sourceItemId: row.sourceItemId,
  sourceItemName: row.sourceItemName,
  reason: row.reason,
  isRead: row.isRead,
  isDismissed: row.isDismissed,
  scannedAt: row.scannedAt.toISOString(),
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});

type SerializedUpcomingSupport = ReturnType<typeof serializeNotification>;

const splitNotificationsByDate = (rows: SerializedUpcomingSupport[]) => {
  const now = new Date();
  const upcoming = rows.filter((row) => {
    if (!row.dueDateISO) return true;
    const due = new Date(row.dueDateISO);
    return !Number.isNaN(due.getTime()) && due >= now;
  });

  const past = rows.filter((row) => {
    if (!row.dueDateISO) return false;
    const due = new Date(row.dueDateISO);
    return !Number.isNaN(due.getTime()) && due < now;
  });

  upcoming.sort((a, b) => {
    if (!a.dueDateISO && !b.dueDateISO) return 0;
    if (!a.dueDateISO) return 1;
    if (!b.dueDateISO) return -1;
    return new Date(a.dueDateISO).getTime() - new Date(b.dueDateISO).getTime();
  });

  past.sort((a, b) => {
    const aTime = a.dueDateISO ? new Date(a.dueDateISO).getTime() : 0;
    const bTime = b.dueDateISO ? new Date(b.dueDateISO).getTime() : 0;
    return bTime - aTime;
  });

  return { upcoming, past };
};

const fetchStoredNotifications = async (userId: string) => {
  if (!upcomingSupportNotificationModel) return [];
  const rows = await upcomingSupportNotificationModel.findMany({
    where: {
      userId,
      isDismissed: false,
    },
    orderBy: [
      { dueDateISO: 'asc' },
      { confidence: 'desc' },
      { createdAt: 'desc' },
    ],
  });
  return rows.map((row: UpcomingSupportRecord) => serializeNotification(row));
};

const getSupportFolderItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId } = req.params;

    if (!googleId) {
      return sendError(res, statusCodes.badRequest, 'User ID is required');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!supportFolderItemModel) {
      return sendError(res, statusCodes.internalServerError, 'Support folder model is not available. Run prisma generate.');
    }

    const items = await supportFolderItemModel.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        type: true,
        mimeType: true,
        sizeBytes: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(statusCodes.success).json({ data: items });
  } catch (error) {
    console.error('Error fetching support folder items:', error);
    return sendError(res, statusCodes.internalServerError, 'Failed to fetch support folder items');
  }
};

const createSupportFolderTextItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId } = req.params;
    const { name, content } = req.body || {};

    if (!googleId) {
      return sendError(res, statusCodes.badRequest, 'User ID is required');
    }

    if (typeof name !== 'string' || name.trim().length === 0) {
      return sendError(res, statusCodes.badRequest, 'Text file name is required');
    }

    if (typeof content !== 'string' || content.trim().length === 0) {
      return sendError(res, statusCodes.badRequest, 'Text file content is required');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!supportFolderItemModel) {
      return sendError(res, statusCodes.internalServerError, 'Support folder model is not available. Run prisma generate.');
    }

    const item = await supportFolderItemModel.create({
      data: {
        userId: user.id,
        name: name.trim(),
        type: 'TEXT',
        mimeType: 'text/plain',
        sizeBytes: Buffer.byteLength(content, 'utf8'),
        content: content.trim(),
      },
      select: {
        id: true,
        name: true,
        type: true,
        mimeType: true,
        sizeBytes: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(statusCodes.created).json({ data: item });
  } catch (error) {
    console.error('Error creating support folder text item:', error);
    return sendError(res, statusCodes.internalServerError, 'Failed to create support folder text item');
  }
};

const uploadSupportFolderFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId } = req.params;
    const file = req.file;

    if (!googleId) {
      return sendError(res, statusCodes.badRequest, 'User ID is required');
    }

    if (!file) {
      return sendError(res, statusCodes.badRequest, 'A file is required');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!supportFolderItemModel) {
      return sendError(res, statusCodes.internalServerError, 'Support folder model is not available. Run prisma generate.');
    }

    const item = await supportFolderItemModel.create({
      data: {
        userId: user.id,
        name: file.originalname,
        type: parseSupportType(file.mimetype),
        mimeType: file.mimetype,
        sizeBytes: file.size,
        fileData: file.buffer,
      },
      select: {
        id: true,
        name: true,
        type: true,
        mimeType: true,
        sizeBytes: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(statusCodes.created).json({ data: item });
  } catch (error) {
    console.error('Error uploading support folder file:', error);
    return sendError(res, statusCodes.internalServerError, 'Failed to upload support folder file');
  }
};

const downloadSupportFolderItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId, itemId } = req.params;

    if (!googleId || !itemId) {
      return sendError(res, statusCodes.badRequest, 'User ID and item ID are required');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!supportFolderItemModel) {
      return sendError(res, statusCodes.internalServerError, 'Support folder model is not available. Run prisma generate.');
    }

    const item = await supportFolderItemModel.findFirst({
      where: {
        id: String(itemId),
        userId: user.id,
      },
    });

    if (!item) {
      return sendError(res, statusCodes.notFound, 'Support folder item not found');
    }

    const fileName = item.name || `support-item-${item.id}`;

    if (item.type === 'TEXT') {
      res.setHeader('Content-Type', item.mimeType || 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName.endsWith('.txt') ? fileName : `${fileName}.txt`}"`);
      return res.status(statusCodes.success).send(item.content || '');
    }

    if (!item.fileData) {
      return sendError(res, statusCodes.notFound, 'File data not found for this item');
    }

    res.setHeader('Content-Type', item.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.status(statusCodes.success).send(Buffer.from(item.fileData));
  } catch (error) {
    console.error('Error downloading support folder item:', error);
    return sendError(res, statusCodes.internalServerError, 'Failed to download support folder item');
  }
};

const deleteSupportFolderItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId, itemId } = req.params;

    if (!googleId || !itemId) {
      return sendError(res, statusCodes.badRequest, 'User ID and item ID are required');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!supportFolderItemModel) {
      return sendError(res, statusCodes.internalServerError, 'Support folder model is not available. Run prisma generate.');
    }

    const item = await supportFolderItemModel.findFirst({
      where: {
        id: String(itemId),
        userId: user.id,
      },
      select: { id: true },
    });

    if (!item) {
      return sendError(res, statusCodes.notFound, 'Support folder item not found');
    }

    await supportFolderItemModel.delete({
      where: { id: item.id },
    });

    return res.status(statusCodes.success).json({ message: 'Support folder item deleted successfully' });
  } catch (error) {
    console.error('Error deleting support folder item:', error);
    return sendError(res, statusCodes.internalServerError, 'Failed to delete support folder item');
  }
};

const runUpcomingSupportRescan = async (userId: string) => {
  if (!supportFolderItemModel) {
    throw new Error('Support folder model is not available. Run prisma generate.');
  }

  if (!upcomingSupportNotificationModel) {
    throw new Error('Upcoming support notification model is not available. Run prisma generate.');
  }

  if (!PYTHON_API_URL) {
    throw new Error('Python API URL is not configured. Set PYTHON_API_URL.');
  }

  const rawItems = await supportFolderItemModel.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: MAX_ANALYSIS_ITEMS,
    select: {
      id: true,
      name: true,
      type: true,
      mimeType: true,
      sizeBytes: true,
      content: true,
      fileData: true,
      createdAt: true,
    },
  });

  let skippedItems = 0;
  const skippedByReason: Record<string, number> = {
    missingFileOrUnsupportedMime: 0,
    oversizedForAnalysis: 0,
    textDecodeFailed: 0,
  };

  const payloadItems = rawItems
    .map((item: any) => {
      if (item.type === 'TEXT' && item.content) {
        return {
          itemId: item.id,
          itemName: item.name,
          itemType: item.type,
          mimeType: item.mimeType,
          createdAt: item.createdAt,
          textContent: String(item.content),
        };
      }

      if (!item.fileData || !isAnalyzableMimeType(item.mimeType)) {
        skippedItems += 1;
        skippedByReason.missingFileOrUnsupportedMime += 1;
        return null;
      }

      if (typeof item.sizeBytes === 'number' && item.sizeBytes > MAX_ANALYSIS_FILE_BYTES) {
        skippedItems += 1;
        skippedByReason.oversizedForAnalysis += 1;
        return null;
      }

      if (item.mimeType?.startsWith('text/')) {
        const decoded = safeUtf8FromBuffer(item.fileData);
        if (!decoded) {
          skippedItems += 1;
          skippedByReason.textDecodeFailed += 1;
          return null;
        }

        return {
          itemId: item.id,
          itemName: item.name,
          itemType: item.type,
          mimeType: item.mimeType,
          createdAt: item.createdAt,
          textContent: decoded,
        };
      }

      return {
        itemId: item.id,
        itemName: item.name,
        itemType: item.type,
        mimeType: item.mimeType,
        createdAt: item.createdAt,
        fileBase64: Buffer.from(item.fileData).toString('base64'),
      };
    })
    .filter(Boolean);

  console.info('Upcoming support rescan payload summary', {
    userId,
    totalItemsFetched: rawItems.length,
    payloadItems: payloadItems.length,
    skippedItems,
    skippedByReason,
  });

  if (payloadItems.length === 0) {
    await upcomingSupportNotificationModel.deleteMany({ where: { userId } });
    return {
      data: [],
      scannedItems: 0,
      skippedItems,
      persistedCount: 0,
    };
  }

  const form = new FormData();
  form.append(
    'metadata',
    JSON.stringify({
      today: new Date().toISOString(),
      items: payloadItems,
    }),
  );

  const response = await fetch(`${normalizeBaseUrl(PYTHON_API_URL)}upcoming-support`, {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to analyze support folder items for upcoming support: ${errorText}`);
  }

  const aiData = await response.json();
  const aiRows = Array.isArray(aiData?.data) ? aiData.data : [];
  console.info('Upcoming support rescan AI response summary', {
    userId,
    aiRows: aiRows.length,
  });

  const dedupedMap = new Map<string, any>();
  for (const row of aiRows) {
    const fingerprint = createFingerprint(row);
    if (!fingerprint || dedupedMap.has(fingerprint)) continue;
    dedupedMap.set(fingerprint, row);
  }

  const dedupedRows = Array.from(dedupedMap.entries()).map(([fingerprint, row]) => ({
    fingerprint,
    title: String(row?.title || 'Upcoming support item').trim(),
    summary: String(row?.summary || '').trim(),
    dueDateISO: parseDueDate(row?.dueDateISO),
    urgency: normalizeUrgency(row?.urgency),
    confidence: normalizeConfidence(row?.confidence),
    sourceItemId: row?.sourceItemId ? String(row.sourceItemId) : null,
    sourceItemName: row?.sourceItemName ? String(row.sourceItemName) : null,
    reason: row?.reason ? String(row.reason) : null,
  }));

  const fingerprintKeys = dedupedRows.map((row) => row.fingerprint);
  const existingRows = fingerprintKeys.length
    ? await upcomingSupportNotificationModel.findMany({
      where: {
        userId,
        fingerprint: { in: fingerprintKeys },
      },
      select: {
        fingerprint: true,
        isRead: true,
      },
    })
    : [];

  const existingMap = new Map<string, { isRead: boolean }>(
    existingRows.map((row: any) => [row.fingerprint, { isRead: row.isRead }]),
  );

  const now = new Date();
  await Promise.all(
    dedupedRows.map((row) => {
      const existing = existingMap.get(row.fingerprint);
      return upcomingSupportNotificationModel.upsert({
        where: {
          userId_fingerprint: {
            userId,
            fingerprint: row.fingerprint,
          },
        },
        create: {
          userId,
          fingerprint: row.fingerprint,
          title: row.title,
          summary: row.summary,
          dueDateISO: row.dueDateISO,
          urgency: row.urgency,
          confidence: row.confidence,
          sourceItemId: row.sourceItemId,
          sourceItemName: row.sourceItemName,
          reason: row.reason,
          isRead: existing?.isRead ?? false,
          // If this item appears again in a fresh scan, make it visible again.
          isDismissed: false,
          scannedAt: now,
        },
        update: {
          title: row.title,
          summary: row.summary,
          dueDateISO: row.dueDateISO,
          urgency: row.urgency,
          confidence: row.confidence,
          sourceItemId: row.sourceItemId,
          sourceItemName: row.sourceItemName,
          reason: row.reason,
          isDismissed: false,
          scannedAt: now,
        },
      });
    }),
  );

  if (fingerprintKeys.length > 0) {
    await upcomingSupportNotificationModel.deleteMany({
      where: {
        userId,
        fingerprint: {
          notIn: fingerprintKeys,
        },
      },
    });
  } else {
    await upcomingSupportNotificationModel.deleteMany({ where: { userId } });
  }

  const stored = await fetchStoredNotifications(userId);
  const split = splitNotificationsByDate(stored);
  return {
    data: split.upcoming,
    pastData: split.past,
    scannedItems: payloadItems.length,
    skippedItems,
    persistedCount: stored.length,
  };
};

const getUpcomingSupportNotifications = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId } = req.params;
    const shouldRescan = String(req.query.rescan || '').toLowerCase() === 'true';

    if (!googleId) {
      return sendError(res, statusCodes.badRequest, 'User ID is required');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!upcomingSupportNotificationModel) {
      return sendError(
        res,
        statusCodes.internalServerError,
        'Upcoming support notification model is not available. Run prisma generate.',
      );
    }

    if (shouldRescan) {
      const scanned = await runUpcomingSupportRescan(user.id);
      return res.status(statusCodes.success).json(scanned);
    }

    const stored = await fetchStoredNotifications(user.id);
    const persistedTotal = await upcomingSupportNotificationModel.count({
      where: { userId: user.id },
    });

    if (stored.length > 0 || persistedTotal > 0) {
      const split = splitNotificationsByDate(stored);
      return res.status(statusCodes.success).json({
        data: split.upcoming,
        pastData: split.past,
        scannedItems: 0,
        skippedItems: 0,
        persistedCount: stored.length,
      });
    }

    const scanned = await runUpcomingSupportRescan(user.id);
    return res.status(statusCodes.success).json(scanned);
  } catch (error) {
    console.error('Error generating upcoming support notifications:', error);
    return sendError(
      res,
      statusCodes.internalServerError,
      'Failed to generate upcoming support notifications',
    );
  }
};

const updateUpcomingSupportReadStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId, notificationId } = req.params;
    const { isRead } = req.body || {};

    if (!googleId || !notificationId) {
      return sendError(res, statusCodes.badRequest, 'User ID and notification ID are required');
    }

    if (typeof isRead !== 'boolean') {
      return sendError(res, statusCodes.badRequest, 'isRead must be a boolean');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!upcomingSupportNotificationModel) {
      return sendError(
        res,
        statusCodes.internalServerError,
        'Upcoming support notification model is not available. Run prisma generate.',
      );
    }

    const existing = await upcomingSupportNotificationModel.findFirst({
      where: {
        id: String(notificationId),
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existing) {
      return sendError(res, statusCodes.notFound, 'Upcoming support notification not found');
    }

    await upcomingSupportNotificationModel.update({
      where: { id: existing.id },
      data: { isRead },
    });

    return res.status(statusCodes.success).json({ message: 'Read status updated' });
  } catch (error) {
    console.error('Error updating upcoming support read status:', error);
    return sendError(
      res,
      statusCodes.internalServerError,
      'Failed to update read status',
    );
  }
};

const updateUpcomingSupportDismissStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId, notificationId } = req.params;
    const { isDismissed } = req.body || {};

    if (!googleId || !notificationId) {
      return sendError(res, statusCodes.badRequest, 'User ID and notification ID are required');
    }

    if (typeof isDismissed !== 'boolean') {
      return sendError(res, statusCodes.badRequest, 'isDismissed must be a boolean');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!upcomingSupportNotificationModel) {
      return sendError(
        res,
        statusCodes.internalServerError,
        'Upcoming support notification model is not available. Run prisma generate.',
      );
    }

    const existing = await upcomingSupportNotificationModel.findFirst({
      where: {
        id: String(notificationId),
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existing) {
      return sendError(res, statusCodes.notFound, 'Upcoming support notification not found');
    }

    await upcomingSupportNotificationModel.update({
      where: { id: existing.id },
      data: { isDismissed },
    });

    return res.status(statusCodes.success).json({ message: 'Dismiss status updated' });
  } catch (error) {
    console.error('Error updating upcoming support dismiss status:', error);
    return sendError(
      res,
      statusCodes.internalServerError,
      'Failed to update dismiss status',
    );
  }
};

const updateUpcomingSupportDueDate = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId, notificationId } = req.params;
    const { dueDateISO } = req.body || {};

    if (!googleId || !notificationId) {
      return sendError(res, statusCodes.badRequest, 'User ID and notification ID are required');
    }

    if (typeof dueDateISO !== 'string' || dueDateISO.trim().length === 0) {
      return sendError(res, statusCodes.badRequest, 'dueDateISO must be a valid ISO date string');
    }

    const parsedDate = new Date(dueDateISO);
    if (Number.isNaN(parsedDate.getTime())) {
      return sendError(res, statusCodes.badRequest, 'dueDateISO is invalid');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!upcomingSupportNotificationModel) {
      return sendError(
        res,
        statusCodes.internalServerError,
        'Upcoming support notification model is not available. Run prisma generate.',
      );
    }

    const existing = await upcomingSupportNotificationModel.findFirst({
      where: {
        id: String(notificationId),
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existing) {
      return sendError(res, statusCodes.notFound, 'Upcoming support notification not found');
    }

    await upcomingSupportNotificationModel.update({
      where: { id: existing.id },
      data: {
        dueDateISO: parsedDate,
        isRead: false,
      },
    });

    return res.status(statusCodes.success).json({ message: 'Due date updated' });
  } catch (error) {
    console.error('Error updating upcoming support due date:', error);
    return sendError(
      res,
      statusCodes.internalServerError,
      'Failed to update due date',
    );
  }
};

const moveUpcomingSupportToUpcoming = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId, notificationId } = req.params;

    if (!googleId || !notificationId) {
      return sendError(res, statusCodes.badRequest, 'User ID and notification ID are required');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!upcomingSupportNotificationModel) {
      return sendError(
        res,
        statusCodes.internalServerError,
        'Upcoming support notification model is not available. Run prisma generate.',
      );
    }

    const existing = await upcomingSupportNotificationModel.findFirst({
      where: {
        id: String(notificationId),
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existing) {
      return sendError(res, statusCodes.notFound, 'Upcoming support notification not found');
    }

    await upcomingSupportNotificationModel.update({
      where: { id: existing.id },
      data: {
        dueDateISO: null,
        isRead: false,
      },
    });

    return res.status(statusCodes.success).json({ message: 'Notification moved to upcoming' });
  } catch (error) {
    console.error('Error moving upcoming support notification:', error);
    return sendError(
      res,
      statusCodes.internalServerError,
      'Failed to move notification to upcoming',
    );
  }
};

const createUpcomingSupportNotificationFromVoice = async (req: Request, res: Response): Promise<any> => {
  try {
    const { googleId } = req.params;
    const { transcript } = req.body || {};

    if (!googleId) {
      return sendError(res, statusCodes.badRequest, 'User ID is required');
    }

    if (typeof transcript !== 'string' || transcript.trim().length === 0) {
      return sendError(res, statusCodes.badRequest, 'Voice transcript is required');
    }

    const user = await findUserByGoogleId(googleId);
    if (!user) {
      return sendError(res, statusCodes.notFound, 'User not found');
    }

    if (!upcomingSupportNotificationModel) {
      return sendError(
        res,
        statusCodes.internalServerError,
        'Upcoming support notification model is not available. Run prisma generate.',
      );
    }

    const cleanTranscript = transcript.trim();
    const now = new Date();

    let derived = {
      title: 'Voice appointment',
      summary: cleanTranscript,
      dueDateISO: null as Date | null,
      urgency: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
      confidence: 0.75,
      reason: 'Created from voice input.',
    };

    if (PYTHON_API_URL) {
      const form = new FormData();
      form.append(
        'metadata',
        JSON.stringify({
          today: now.toISOString(),
          items: [
            {
              itemId: `voice-${randomUUID()}`,
              itemName: 'Voice appointment note',
              itemType: 'TEXT',
              mimeType: 'text/plain',
              createdAt: now.toISOString(),
              textContent: cleanTranscript,
            },
          ],
        }),
      );

      const response = await fetch(`${normalizeBaseUrl(PYTHON_API_URL)}upcoming-support`, {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        const aiData = await response.json().catch(() => ({}));
        const aiRows = Array.isArray(aiData?.data) ? aiData.data : [];
        if (aiRows.length > 0) {
          const first = aiRows[0] || {};
          derived = {
            title: String(first?.title || derived.title).trim(),
            summary: String(first?.summary || derived.summary).trim(),
            dueDateISO: parseDueDate(first?.dueDateISO),
            urgency: normalizeUrgency(first?.urgency),
            confidence: normalizeConfidence(first?.confidence),
            reason: String(first?.reason || 'Created from voice input.').trim(),
          };
        }
      }
    }

    if (!derived.dueDateISO) {
      const inferredDueDate = inferDueDateFromVoiceTranscript(cleanTranscript, now);
      if (inferredDueDate) {
        derived = {
          ...derived,
          dueDateISO: inferredDueDate,
          reason: derived.reason || 'Parsed date/time from voice input.',
        };
      }
    }

    const row = await upcomingSupportNotificationModel.create({
      data: {
        userId: user.id,
        fingerprint: `voice|${randomUUID()}`,
        title: derived.title || 'Voice appointment',
        summary: derived.summary || cleanTranscript,
        dueDateISO: derived.dueDateISO,
        urgency: derived.urgency,
        confidence: derived.confidence,
        sourceItemId: null,
        sourceItemName: 'Voice appointment',
        reason: derived.reason || 'Created from voice input.',
        isRead: false,
        isDismissed: false,
        scannedAt: now,
      },
    });

    return res.status(statusCodes.created).json({ data: serializeNotification(row) });
  } catch (error) {
    console.error('Error creating upcoming support notification from voice:', error);
    return sendError(
      res,
      statusCodes.internalServerError,
      'Failed to create appointment from voice input',
    );
  }
};

export {
  getSupportFolderItems,
  createSupportFolderTextItem,
  uploadSupportFolderFile,
  downloadSupportFolderItem,
  deleteSupportFolderItem,
  getUpcomingSupportNotifications,
  updateUpcomingSupportReadStatus,
  updateUpcomingSupportDismissStatus,
  updateUpcomingSupportDueDate,
  moveUpcomingSupportToUpcoming,
  createUpcomingSupportNotificationFromVoice,
};
