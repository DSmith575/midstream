import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getServiceCategories = async (req: Request, res: Response): Promise<any> => {
  try {
    // TODO: Allow pagination values
    // TODO: Allow filtering
    const categories = await prisma.serviceCategory.findMany();

    if (categories.length === 0) {
      return res.status(404).json({ message: "No service categories found" });
    }

    return res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to get service categories" })
  }
}