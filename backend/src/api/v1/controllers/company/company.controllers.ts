import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    if (!req.body || req.body.length === 0) {
      return res.status(400).send({ message: "Content cannot be empty!" });
    }

    const { companyName, abn, address, suburb, city, postCode, country } = req.body;

    const result = await prisma.company.create({
      data: {
        name: companyName,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}