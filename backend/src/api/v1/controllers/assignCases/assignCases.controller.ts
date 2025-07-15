import { PrismaClient, ReferralStatus } from "@prisma/client";
import { Request, Response } from "express";
import { orgRoles } from "@/constants";

const prisma = new PrismaClient();

const updateReferralForm = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		if (!req.body || req.body.length === 0) {
			return res.status(400).send({ message: "Content cannot be empty!" });
		}

		const { referralId, caseWorkerId, orgRole } = req.body;

		if (orgRole !== orgRoles.organizationAdmin) {
			return res.status(403).json({ message: "Forbidden" });
		}

		const caseWorkerExists = await prisma.user.findUnique({
			where: {
				googleId: String(caseWorkerId),
			},
		});

		if (!caseWorkerExists) {
			return res.status(400).json({ message: "User does not exist" });
		}

		const caseWorker = caseWorkerExists.id;

		const referralExists = await prisma.referralForm.findUnique({
			where: {
				id: String(referralId),
			},
		});

		if (!referralExists) {
			return res.status(400).json({ message: "Referral does not exist" });
		}

		const referral = await prisma.referralForm.update({
			where: {
				id: String(referralId),
			},
			data: {
				assignedToWorkerId: caseWorker,
				status: ReferralStatus.ASSIGNED,
			},
		});

		// update counter for the case worker assigned
		await prisma.user.update({
			where: {
				id: caseWorker,
			},
			data: {
				casesAssigned: {
					increment: 1,
				},
			},
		});

		return res.status(200).json(referral);
	} catch (error) {
		console.error("Error updating referral form:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export { updateReferralForm };
