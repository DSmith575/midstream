import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { GenerateEligibleServicePlanEntries } from "./serviceEligibility";
import { getServiceCategories } from "./serviceCategory.controller";

const prisma = new PrismaClient();

export const createServicePlan = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		if (!req.body || req.body.length === 0) {
			return res.status(400).send({ message: "Content cannot be empty!" });
		}

		const { serviceCaseId } = req.body;

    const serviceCase = await prisma.serviceCase.findUnique({
      where: {
        id: String(serviceCaseId),
      },
			include: {
				referralForm: {
					include: {
						disability: true
					}
				}
			}
    })

		if (!serviceCase) {
			return res.status(400).json({ message: "Service case doesn't exist" });
		}

		const result = await prisma.$transaction(async (prisma) => {
			try {
        const servicePlan = await prisma.servicePlan.create({
          data: {
            serviceCaseId
          }
        })

        const prefilledEntries = await GenerateEligibleServicePlanEntries(prisma, servicePlan.id, serviceCase);
        await prisma.servicePlanEntry.createMany({
          data: prefilledEntries
        });
        
				return servicePlan;
			} catch (error) {
				// UPDATE THIS
				console.error(error);
				throw error;
			}
		});

		return res.status(201).json({
			message: "Service plan created successfully",
			data: result,
		});
	} catch (error) {
		res.status(500).json({ error: "Failed to create service plan" });
	}
};

export const getServicePlan = async (req: Request, res: Response): Promise<any> => {
	try {
		const { servicePlanId } = req.params;

		const servicePlan = await prisma.servicePlan.findUnique({
			where: {
				id: String(servicePlanId),
			},
			include: {
				services: {
					include: {
						serviceCategory: true,
						comments: true,
					}
				},
				serviceCase: {
					include: {
						user: {
							include: {
								personalInformation: true
							}
						}
					}
				}
			}
		});

		if (!servicePlan) {
			return res.status(400).json({ message: "Service plan not found" });
		}
		return res.status(200).json({ data: servicePlan });
	} catch (error) {
		res.status(500).json({ error: "Failed to get service plan" });
	}
};