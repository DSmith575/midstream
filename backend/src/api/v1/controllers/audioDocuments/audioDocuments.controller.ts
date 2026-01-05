import { statusCodes } from '@/constants';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import multer from 'multer';


const prisma = new PrismaClient();

const createAudioDocumentReferralHandler = async (req: Request, res: Response): Promise<any> => {
  const { referralId, transcribedContent, name, type } = req.body;

  if (!referralId || !name) {
    return res.status(400).json({ message: 'referralId and name are required' });
  }

  try {
    const document = await prisma.document.create({
      data: {
        name,
        referralId,
        type: type || 'PDF',
        transcribedContent: transcribedContent || null,
      },
    });

    return res.status(statusCodes.created).json({
      statusCode: res.statusCode,
      message: 'Audio document created successfully',
      document,
    });
  } catch (error) {
    console.error('Error creating audio document:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateDocumentTranscribedContent = async (req: Request, res: Response): Promise<any> => {
  const { documentId } = req.params;
  const { transcribedContent } = req.body;

  if (!documentId) {
    return res.status(400).json({ message: 'documentId is required' });
  }

  if (typeof transcribedContent !== 'string') {
    return res.status(400).json({ message: 'transcribedContent must be a string' });
  }

  try {
    const document = await prisma.document.update({
      where: { id: documentId },
      data: { transcribedContent },
    });

    return res.status(200).json({
      statusCode: res.statusCode,
      message: 'Document updated successfully',
      document,
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { createAudioDocumentReferralHandler, updateDocumentTranscribedContent };
