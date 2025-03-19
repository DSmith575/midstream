import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createReferralForm = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		if (!req.body || req.body.length === 0) {
			return res.status(400).send({ message: "Content cannot be empty!" });
		}

		const { googleId } = req.body;

		const userExists = await prisma.user.findUnique({
			where: {
				googleId: String(googleId),
			},
		});

		if (!userExists) {
			return res.status(400).json({ message: "User does not exist" });
		}
		const {
			userProfile,
			addressInformation,
			contactInformation,
			doctorInfo,
			disabilityInfo,
			additionalInfo,
			referrerInfo,
			emergencyContactInfo,
			consentInfo,
		} = req.body;


    const consentInformation = {
      provideInformation: consentInfo.provideInformation === 'Yes',
      shareInformation: consentInfo.shareInformation === 'Yes',
      contactedForAdditionalInformation: consentInfo.contactedForAdditionalInformation === 'Yes',
      statisticalInformation: consentInfo.statisticalInformation === 'Yes',
      correctInformationProvided: consentInfo.correctInformationProvided === 'Yes',
    }
    

    console.log(consentInfo);
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

export { createReferralForm };
