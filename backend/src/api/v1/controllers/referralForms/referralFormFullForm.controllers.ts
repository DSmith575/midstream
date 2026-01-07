import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { statusCodes } from "@/constants";

const prisma = new PrismaClient();
const PYTHON_API_URL = process.env.PYTHON_API_KEY;

// Include object for referral form data
const REFERRAL_FORM_INCLUDE = {
	communication: true,
	disability: true,
	additionalInformation: true,
	documents: true,
	notes: true,
};

// Helper functions
const sendError = (res: Response, status: number, message: string) => {
	return res.status(status).json({ message });
};

const sendReferralToPythonService = async (referralForm: any) => {
	const form = new FormData();
	
	// Send the entire referralForm as metadata (including documents as transcribed content)
	form.append("metadata", JSON.stringify(referralForm));

	const response = await fetch(`${PYTHON_API_URL}generate-referral`, {
		method: "POST",
		body: form,
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error("Python API error response:", errorText);
		throw new Error(`Python API error: ${response.statusText} - ${errorText}`);
	}

	return response;
};

const generateFullReferralForm = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		if (!req.body || req.body.length === 0) {
			return sendError(res, statusCodes.badRequest, "Content cannot be empty!");
		}

		const { referralFormId } = req.body;

		const referralFormData = await prisma.referralForm.findUnique({
			where: { id: String(referralFormId) },
			include: REFERRAL_FORM_INCLUDE,
		});

		if (!referralFormData) {
			return sendError(res, statusCodes.notFound, "Referral form not found");
		}

		const userData = await prisma.user.findUnique({
			where: { id: String(referralFormData.userId) },
			include: {
				personalInformation: true,
			},
		});

		if (!userData) {
			return sendError(res, statusCodes.notFound, "User not found");
		}

		const referralForm = {
			firstName: userData.personalInformation?.firstName,
			lastName: userData.personalInformation?.lastName,
			communication: referralFormData.communication,
			disability: referralFormData.disability,
			additionalInformation: referralFormData.additionalInformation,
			documents: referralFormData.documents,
			notes: referralFormData.notes || [],
		};

		const pythonResponse = await sendReferralToPythonService(referralForm);

		if (!pythonResponse.body) {
			return res.status(statusCodes.internalServerError).send("No PDF received from Python service");
		}

		const pdfBuffer = Buffer.from(await pythonResponse.arrayBuffer());

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${referralForm.firstName}-${referralForm.lastName}-referral.pdf"`
		);

		res.send(pdfBuffer);
	} catch (error) {
		console.error("Error creating full referral form:", error);
		return sendError(res, statusCodes.internalServerError, "Internal server error");
	}
};

export { generateFullReferralForm };
