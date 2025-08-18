import { statusCodes } from '@/constants';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import multer from 'multer';


const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

const createAudioDocumentReferralHandler = (req: Request, res: Response) => {
  upload.single('pdf')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    const referralId = req.body.referralId;
    const file = req.file;

    if (!file || !referralId) {
      return res.status(400).json({ message: 'File and referralId are required' });
    }

    try {
      const document = await prisma.document.create({
        data: {
          name: file.originalname,
          referralId,
          type: 'PDF',
          pdfFile: file.buffer,
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
  });
};
export { createAudioDocumentReferralHandler };
