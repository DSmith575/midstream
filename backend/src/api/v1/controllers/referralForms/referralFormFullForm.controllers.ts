import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Readable } from "stream";

const prisma = new PrismaClient();
const PYTHON_API_URL = process.env.PYTHON_API_KEY;

const generateFullReferralForm = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		if (!req.body || req.body.length === 0) {
			return res.status(400).send({ message: "Content cannot be empty!" });
		}

		// Get user ReferralForm by Id
		const { referralFormId } = req.body;
		const referralFormData = await prisma.referralForm.findUnique({
			where: { id: String(referralFormId) },
			include: {
				communication: true,
				disability: true,
				additionalInformation: true,
				documents: true,
			},
		});

		if (!referralFormData) {
			return res.status(404).json({ message: "Referral form not found" });
		}

		// Get user personal information
		const userData = await prisma.user.findUnique({
			where: { id: String(referralFormData.userId) },
			include: {
				personalInformation: true,
			},
		});

		if (!userData) {
			return res.status(404).json({ message: "User not found" });
		}

		// Combine referral form data with user personal information
		const referralForm = {
			firstName: userData.personalInformation?.firstName,
			lastName: userData.personalInformation?.lastName,
			communication: referralFormData.communication,
			disability: referralFormData.disability,
			additionalInformation: referralFormData.additionalInformation,
			documents: referralFormData.documents,
		};

		const pythonResponse = await sendReferralToPythonService(referralForm);

    if (!pythonResponse.body) {
      return res.status(500).send("No PDF received from Python service");
    }

    const pdfBuffer = Buffer.from(await pythonResponse.arrayBuffer());

    // Set headers to trigger download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${referralForm.firstName}-${referralForm.lastName}-referral.pdf"`
    );

    // Send the PDF buffer
    res.send(pdfBuffer);

	} catch (error) {
		console.error("Error creating full referral form:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const sendReferralToPythonService = async (referralForm: any) => {
	try {
		const form = new FormData();

		const { documents, ...metadataWithoutDocs } = referralForm;

		form.append("metadata", JSON.stringify(metadataWithoutDocs));

		// Append each document
		for (const doc of documents) {
			const byteArray = Object.values(doc.rawBytes);
			const uint8Array = new Uint8Array(byteArray as any);

			const blob = new Blob([uint8Array], { type: "application/pdf" });
			form.append("files", blob, doc.name);
		}

		console.log("Form Data Prepared:", form);

		// Send to Python API
		const response = await fetch(
			`${PYTHON_API_URL}generate-referral`,
			{
				method: "POST",
				body: form,
			}
		);

		if (!response.ok) {
			throw new Error(`Python API error: ${response.statusText}`);
		}

		return response;
	} catch (error) {
		console.error("Error sending referral to Python service:", error);
		throw error;
	}
};

export { generateFullReferralForm };
