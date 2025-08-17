import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Currently we don't have GET routes for entries
// They are only received as part of the full service plan

export const createServicePlanEntry = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    if (!req.body || req.body.length === 0) {
      return res.status(400).send({ message: "Content cannot be empty!" })
    }

    const { servicePlanId, serviceCategoryId, allocatedMinutes, comment, userId } = req.body;

    const servicePlan = await prisma.servicePlan.findUnique({
      where: {
        id: String(servicePlanId),
      }
    })

    if (!servicePlan) {
      return res.status(400).json({ message: "Service plan does not exist" })
    }

    const result = await prisma.$transaction(async (prisma) => {
      try {
        const servicePlanEntry = await prisma.servicePlanEntry.create({
          data: {
            servicePlanId,
            serviceCategoryId,
            allocatedMinutes
          }
        });
        if (comment && comment.length) {
          await prisma.servicePlanEntryComment.create({
            data: {
              servicePlanEntryId: servicePlanEntry.id,
              comment: comment,
              authorId: userId
            }
          })
        }
      } catch (error) {
				// UPDATE THIS
				console.error(error);
				throw error;
      }
    });

    return res.status(201).json({
      message: "Service plan entry created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create service plan entry" });
  }
}

// TODO: Allow editing service plan entries
// TODO: Add permission checking
export const deleteServicePlanEntry = async (req: Request, res: Response): Promise<any> => {
  try {
    const { servicePlanEntryId } = req.params;

    await prisma.servicePlanEntryComment.deleteMany({
      where: {
        servicePlanEntryId: servicePlanEntryId
      }
    });
    await prisma.servicePlanEntry.delete({
      where: {
        id: servicePlanEntryId
      }
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete service plan entry" })
  }
}