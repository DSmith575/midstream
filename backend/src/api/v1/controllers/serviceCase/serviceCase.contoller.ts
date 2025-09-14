import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getServiceCase = async (req: Request, res: Response): Promise<any> => {
  try {
    const { serviceCaseId, caseWorkerId } = req.query;

    if (!(serviceCaseId || caseWorkerId)) {
      return res.status(400).json({ message: "Query must include a filter value" })
    }

    let whereClause = {};
    if (serviceCaseId) {
      whereClause = {
        ...whereClause,
        id: serviceCaseId
      }
    }
    if (caseWorkerId) {
      const caseWorker = await prisma.user.findUnique({
        where: {
          googleId: String(caseWorkerId)
        }
      })
      if (!caseWorker) {
        return res.status(400).json({ error: "caseWorker does not exist" });
      }
      whereClause = {
        ...whereClause,
        workerId: caseWorker.id
      }
    }

    const serviceCases = await prisma.serviceCase.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            personalInformation: true,
            addressInformation: true,
          }
        },
        caseWorker: {
          include: {
            personalInformation: true,
          }
        },
        referralForm: true,
        servicePlan: {
          include: {
            services: {
              include: {
                serviceCategory: true
              }
            }
          }
        }
      }
    });

    return res.status(200).json({ data: serviceCases });
  } catch (error) {
    res.status(500).json({ error: "Failed to get service categories" });
  }
}