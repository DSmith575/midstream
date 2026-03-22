import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { statusCodes } from '@/constants';

const prisma = new PrismaClient();

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

const supportFolderItemModel = (prisma as any).supportFolderItem;

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

export {
  getSupportFolderItems,
  createSupportFolderTextItem,
  uploadSupportFolderFile,
  downloadSupportFolderItem,
  deleteSupportFolderItem,
};
