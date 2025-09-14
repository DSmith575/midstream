import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Currently we don't have GET routes for comments
// They are only received as part of the full service plan

export const createServicePlanEntryComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    if (!req.body || req.body.length === 0) {
      return res.status(400).send({ message: "Content cannot be empty!" })
    }

    const { servicePlanEntryId, userId, comment } = req.body;

    const servicePlanEntry = await prisma.servicePlan.findUnique({
      where: {
        id: String(servicePlanEntryId),
      }
    })

    if (!servicePlanEntry) {
      return res.status(400).json({ message: "Service plan entry does not exist" })
    }

    const result = await prisma.servicePlanEntryComment.create({
      data: {
        servicePlanEntryId,
        comment,
        authorId: userId,
      }
    })

    return res.status(201).json({
      message: "Service plan entry created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create service plan entry" });
  }
}

// TODO: Allow editing comments
// TODO: Add permission checking
export const deleteServicePlanEntryComment = async (req: Request, res: Response): Promise<any> => {
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