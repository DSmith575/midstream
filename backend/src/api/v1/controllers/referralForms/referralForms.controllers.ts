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

		const userId = userExists.id;

		const {
			userProfile,
			addressInformation,
			contactInformation,
			languageInfo,
			doctorInfo,
			disabilityInfo,
			additionalInfo,
			referrerInfo,
			emergencyContactInfo,
			consentInfo,
			companyId,
		} = req.body;

		const checkCompany = await prisma.company.findUnique({
			where: {
				id: String(companyId),
			},
		});

		if (!checkCompany) {
			return res.status(400).json({ message: "Company does not exist" });
		}

		const result = await prisma.$transaction(async (prisma) => {
			try {
				const languageData = await prisma.referralCommunication.create({
					data: {
						firstLanguage: languageInfo.firstLanguage,
						interpreter: languageInfo.interpreter === "Yes",
						culturalSupport: languageInfo.culturalSupport === "Yes",
						communicationNeeds: languageInfo.communicationNeeds === "Yes",
						communicationNeedsDetails:
							languageInfo.communicationNeeds === "Yes"
								? languageInfo.communicationNeedsDetails
								: null,
					},
				});

				const referralDoctorData = await prisma.referralMedical.create({
					data: {
						doctorName: doctorInfo.doctorName,
						doctorPhone: doctorInfo.doctorPhone,
						doctorAddress: doctorInfo.doctorAddress,
						doctorSuburb: doctorInfo.doctorSuburb,
						doctorCity: doctorInfo.doctorCity,
						nhiNumber: doctorInfo.nationalHealthIndex,
					},
				});

				const referralDisabilityData = await prisma.referralDisability.create({
					data: {
						disabilityType: disabilityInfo.disabilityType,
						disabilityDetails: disabilityInfo.disabilityDetails,
						disabilitySupportDetails: disabilityInfo.disabilitySupportDetails,
						disabilityReasonForReferral:
							disabilityInfo.disabilityReasonForReferral,
						disabilitySupportRequired: disabilityInfo.disabilitySupportRequired,
					},
				});

				const referralAdditionalData =
					await prisma.additionalInformation.create({
						data: {
							safety: additionalInfo.safety,
							otherImportantInformation:
								additionalInfo.otherImportantInformation,
						},
					});

				const referralReferrerData = await prisma.referrer.create({
					data: {
						firstName: referrerInfo.referrerFirstName,
						lastName: referrerInfo.referrerLastName,
						email: referrerInfo.referrerEmail,
						phone: referrerInfo.referrerPhone,
						relationship: referrerInfo.referrerRelationship,
					},
				});

				const referralEmergencyContactData =
					await prisma.emergencyContact.create({
						data: {
							firstName: emergencyContactInfo.emergencyContactFirstName,
							lastName: emergencyContactInfo.emergencyContactLastName,
							email: emergencyContactInfo.emergencyContactEmail,
							phone: emergencyContactInfo.emergencyContactPhone,
							relationship: emergencyContactInfo.emergencyContactRelationship,
						},
					});

				const consentData = await prisma.referralConsent.create({
					data: {
						provideInformationConsent: consentInfo.provideInformation === "Yes",
						provideSharedInformationConsent:
							consentInfo.shareInformation === "Yes",
						provideContactConsent:
							consentInfo.contactedForAdditionalInformation === "Yes",
						provideStatisticalConsent:
							consentInfo.statisticalInformation === "Yes",
						provideCorrectInformation:
							consentInfo.correctInformationProvided === "Yes",
					},
				});

				const referralData = await prisma.referralForm.create({
					data: {
						userId: userId,
						communicationId: languageData.id,
						medicalId: referralDoctorData.id,
						disabilityId: referralDisabilityData.id,
						referrerId: referralReferrerData.id,
						emergencyContactId: referralEmergencyContactData.id,
						consentId: consentData.id,
						additionalInformationId: referralAdditionalData.id,
						companyId: companyId,
					},
				});

				return referralData;
			} catch (error) {
				// UPDATE THIS
				console.error(error);
				throw error;
			}
		});

		return res.status(201).json({
			message: "Referral form created successfully",
			data: result,
		});
	} catch (error) {
		res.status(500).json({ error: "Failed to create referral form" });
	}
};

const getUserReferrals = async (req: Request, res: Response): Promise<any> => {
	try {
		const { googleId } = req.params;

		const userExists = await prisma.user.findUnique({
			where: {
				googleId: String(googleId),
			},
		});

		if (!userExists) {
			return res.status(400).json({ message: "User does not exist" });
		}

		const userId = userExists.id;
		const referrals = await prisma.referralForm.findMany({
			where: { userId: String(userId) },
			include: {
				documents: true,
				user: {
					include: {
						contactInformation: true,
						personalInformation: true,
						addressInformation: true,
					},
				},
				communication: true,
				medical: true,
				disability: true,
				referrer: true,
				emergencyContact: true,
				consent: true,
				assignedToWorker: {
					include: {
						personalInformation: true,
						addressInformation: true,
						contactInformation: true,
						company: true,
					},
				},
			},
		});

		if (referrals.length === 0) {
			return res.status(404).json({ message: "No referrals found" });
		}
		
const referralsWithBase64Docs = referrals.map((referral) => ({
  ...referral,
  documents: referral.documents
  .filter((doc) => doc.rawBytes)
  .map((doc) => ({
    ...doc,
    rawBytes: Buffer.from(doc.rawBytes).toString("base64"),
  })),
}))

		return res.status(200).json({ data: referralsWithBase64Docs });
	} catch (error) {
		res.status(500).json({ error: "Failed to get referrals" });
	}
};

const getAllReferrals = async (req: Request, res: Response): Promise<any> => {
	try {
		const { companyId } = req.params;
        const workerId = req.query?.assignedWorkerId as string | undefined;

        let whereClause: any = {
		    companyId: String(companyId),
        };

        if (workerId) {
            whereClause = { ...whereClause,
                assignedToWorker: {
                    googleId: String(workerId),
                }
            }
        } else {
            whereClause = { ...whereClause,
                assignedToWorkerId: null,
            }
        }

		const referrals = await prisma.referralForm.findMany({
			where: whereClause,
			include: {
				user: {
					include: {
						contactInformation: true,
						personalInformation: true,
						addressInformation: true,
					},
				},
				additionalInformation: true,
				referrer: true,
				emergencyContact: true,
				communication: true,
				medical: true,
				disability: true,
				consent: true,
				assignedToWorker: {
					include: {
						personalInformation: true,
						addressInformation: true,
						contactInformation: true,
						company: true,
					},
				},
			},
		});

		if (referrals.length === 0) {
			return res.status(404).json({ message: "No referrals found" });
		}

		return res.status(200).json({ data: referrals });
	} catch (error) {
		res.status(500).json({ error: "Failed to get referrals" });
	}
};

const getCaseWorkerReferrals = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const { googleId } = req.params;

		const userExists = await prisma.user.findUnique({
			where: {
				googleId: String(googleId),
			},
		});

		if (!userExists) {
			return res.status(400).json({ message: "User does not exist" });
		}

		const userId = userExists.id;
		const referrals = await prisma.referralForm.findMany({
			where: { assignedToWorkerId: String(userId) },
			include: {
				user: {
					include: {
						contactInformation: true,
						personalInformation: true,
						addressInformation: true,
					},
				},
				assignedToWorker: {
					include: {
						personalInformation: true,
						addressInformation: true,
						contactInformation: true,
					},
				},
				additionalInformation: true,
				referrer: true,
				emergencyContact: true,
				communication: true,
				medical: true,
				disability: true,
				consent: true,
			},
		});

		if (referrals.length === 0) {
			return res.status(404).json({ message: "No referrals found" });
		}

		return res.status(200).json({ data: referrals });
	} catch (error) {
		res.status(500).json({ error: "Failed to get referrals" });
	}
};

export {
	createReferralForm,
	getUserReferrals,
	getAllReferrals,
	getCaseWorkerReferrals,
};
