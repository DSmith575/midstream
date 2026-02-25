import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { statusCodes } from "@/constants";

const prisma = new PrismaClient();

// Reusable include objects for referral queries
const REFERRAL_USER_INCLUDE = {
	contactInformation: true,
	personalInformation: true,
	addressInformation: true,
};

const REFERRAL_FORM_INCLUDE = {
	documents: true,
	user: {
		include: REFERRAL_USER_INCLUDE,
	},
	communication: true,
	medical: true,
	disability: true,
	referrer: true,
	emergencyContact: true,
	consent: true,
	additionalInformation: true,
	goals: true,
	notes: {
		orderBy: {
			createdAt: 'desc' as const,
		},
	},
	assignedToWorker: {
		include: {
			personalInformation: true,
			addressInformation: true,
			contactInformation: true,
			company: true,
		},
	},
};

const REFERRAL_FORM_INCLUDE_NO_NOTES = {
	user: {
		include: REFERRAL_USER_INCLUDE,
	},
	additionalInformation: true,
	referrer: true,
	emergencyContact: true,
	communication: true,
	medical: true,
	disability: true,
	consent: true,
	goals: true,
	assignedToWorker: {
		include: {
			personalInformation: true,
			addressInformation: true,
			contactInformation: true,
			company: true,
		},
	},
};

// Helper functions
const findUserByGoogleId = async (googleId: string) => {
	return prisma.user.findUnique({
		where: { googleId: String(googleId) },
	});
};

const sendError = (res: Response, status: number, message: string) => {
	return res.status(status).json({ message });
};

const sendSuccess = (res: Response, data: any, status: number = 200) => {
	return res.status(status).json({ data });
};

// Controllers
const createReferralForm = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		if (!req.body || req.body.length === 0) {
			return sendError(res, statusCodes.badRequest, "Content cannot be empty!");
		}

		const { googleId, companyId, languageInfo, doctorInfo, disabilityInfo, additionalInfo, referrerInfo, emergencyContactInfo, consentInfo, goalsInfo } = req.body;

		const userExists = await findUserByGoogleId(googleId);
		if (!userExists) {
			return sendError(res, statusCodes.badRequest, "User does not exist");
		}

		const checkCompany = await prisma.company.findUnique({
			where: { id: String(companyId) },
		});
		if (!checkCompany) {
			return sendError(res, statusCodes.badRequest, "Company does not exist");
		}

		const result = await prisma.$transaction(async (prisma) => {
			const languageData = await prisma.referralCommunication.create({
				data: {
					firstLanguage: languageInfo.firstLanguage,
					interpreter: languageInfo.interpreter === "Yes",
					culturalSupport: languageInfo.culturalSupport === "Yes",
					communicationNeeds: languageInfo.communicationNeeds === "Yes",
					communicationNeedsDetails: languageInfo.communicationNeeds === "Yes" ? languageInfo.communicationNeedsDetails : null,
				},
			});

		const referralGoalsData = await prisma.referralGoals.create({
						data: {
							whanauGoal: goalsInfo.whanauGoal,
							aspiration: goalsInfo.aspiration,
							biggestBarrier: goalsInfo.biggestBarrier,
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
					disabilityReasonForReferral: disabilityInfo.disabilityReasonForReferral,
					disabilitySupportRequired: disabilityInfo.disabilitySupportRequired,
				},
			});

			const referralAdditionalData = await prisma.additionalInformation.create({
				data: {
					safety: additionalInfo.safety,
					otherImportantInformation: additionalInfo.otherImportantInformation,
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

			const referralEmergencyContactData = await prisma.emergencyContact.create({
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
					provideSharedInformationConsent: consentInfo.shareInformation === "Yes",
					provideContactConsent: consentInfo.contactedForAdditionalInformation === "Yes",
					provideStatisticalConsent: consentInfo.statisticalInformation === "Yes",
					provideCorrectInformation: consentInfo.correctInformationProvided === "Yes",
				},
			});

			return prisma.referralForm.create({
				data: {
					userId: userExists.id,
					communicationId: languageData.id,
					medicalId: referralDoctorData.id,
					disabilityId: referralDisabilityData.id,
					goalsId: referralGoalsData?.id || null,
					referrerId: referralReferrerData.id,
					emergencyContactId: referralEmergencyContactData.id,
					consentId: consentData.id,
					additionalInformationId: referralAdditionalData.id,
					companyId: companyId,
					checklistAudioComplete: false,
					checklistNotesComplete: false,
					checklistReviewComplete: false,
					checklistSubmitComplete: false,
				},
			});
		});

		return res.status(statusCodes.created).json({
			message: "Referral form created successfully",
			data: result,
		});
	} catch (error) {
		console.error(error);
		return sendError(res, statusCodes.internalServerError, "Failed to create referral form");
	}
};

const getUserReferrals = async (req: Request, res: Response): Promise<any> => {
	try {
		const { googleId } = req.params;

		const userExists = await findUserByGoogleId(googleId);
		if (!userExists) {
			return sendError(res, statusCodes.badRequest, "User does not exist");
		}

		const referrals = await prisma.referralForm.findMany({
			where: { userId: String(userExists.id) },
			include: REFERRAL_FORM_INCLUDE,
		});

		if (referrals.length === 0) {
			return res.status(statusCodes.notFound).json({ data: [] });
		}

		return sendSuccess(res, referrals);
	} catch (error) {
		console.error(error);
		return sendError(res, statusCodes.internalServerError, "Failed to get referrals");
	}
};

const getAllReferrals = async (req: Request, res: Response): Promise<any> => {
	try {
		const { companyId } = req.params;
		const workerId = req.query?.assignedWorkerId as string | undefined;

		const whereClause: any = {
			companyId: String(companyId),
		};

		if (workerId) {
			whereClause.assignedToWorker = {
				googleId: String(workerId),
			};
		} else {
			whereClause.assignedToWorkerId = null;
		}

		const referrals = await prisma.referralForm.findMany({
			where: whereClause,
			include: REFERRAL_FORM_INCLUDE_NO_NOTES,
		});

		if (referrals.length === 0) {
			return res.status(statusCodes.notFound).json({ data: [] });
		}

		return sendSuccess(res, referrals);
	} catch (error) {
		console.error(error);
		return sendError(res, statusCodes.internalServerError, "Failed to get referrals");
	}
};

const getCaseWorkerReferrals = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const { googleId } = req.params;

		const userExists = await findUserByGoogleId(googleId);
		if (!userExists) {
			return sendError(res, statusCodes.badRequest, "User does not exist");
		}

		const referrals = await prisma.referralForm.findMany({
			where: { assignedToWorkerId: String(userExists.id) },
			include: REFERRAL_FORM_INCLUDE_NO_NOTES,
		});

		if (referrals.length === 0) {
			return res.status(statusCodes.notFound).json({ data: [] });
		}

		return sendSuccess(res, referrals);
	} catch (error) {
		console.error(error);
		return sendError(res, statusCodes.internalServerError, "Failed to get referrals");
	}
};

const updateReferralChecklist = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const { referralId } = req.params;
		const { audio, notes, review, submit } = req.body || {};

		if (!referralId) {
			return sendError(res, statusCodes.badRequest, "Referral ID is required");
		}

		const data: Record<string, boolean> = {};
		if (typeof audio === "boolean") data.checklistAudioComplete = audio;
		if (typeof notes === "boolean") data.checklistNotesComplete = notes;
		if (typeof review === "boolean") data.checklistReviewComplete = review;
		if (typeof submit === "boolean") data.checklistSubmitComplete = submit;

		if (Object.keys(data).length === 0) {
			return sendError(res, statusCodes.badRequest, "No valid checklist fields provided");
		}

		const updated = await prisma.referralForm.update({
			where: { id: String(referralId) },
			data,
		});

		return res.status(statusCodes.success).json({ message: "Checklist updated", data: updated });
	} catch (error) {
		console.error(error);
		return sendError(res, statusCodes.internalServerError, "Failed to update checklist");
	}
};

const createReferralNote = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const { referralId } = req.params;
		const { content } = req.body || {};

		if (!referralId) {
			return sendError(res, statusCodes.badRequest, "Referral ID is required");
		}

		if (typeof content !== "string" || content.trim().length === 0) {
			return sendError(res, statusCodes.badRequest, "Note content is required");
		}

		const referral = await prisma.referralForm.findUnique({
			where: { id: String(referralId) },
		});

		if (!referral) {
			return sendError(res, statusCodes.notFound, "Referral not found");
		}

		const newNote = await prisma.referralNote.create({
			data: {
				referralId: String(referralId),
				content: content.trim(),
			},
		});

		await prisma.referralForm.update({
			where: { id: String(referralId) },
			data: { checklistNotesComplete: true },
		});

		return res.status(statusCodes.created).json({ message: "Note created", data: newNote });
	} catch (error) {
		console.error(error);
		return sendError(res, statusCodes.internalServerError, "Failed to create note");
	}
};

export {
	createReferralForm,
	getUserReferrals,
	getAllReferrals,
	getCaseWorkerReferrals,
	updateReferralChecklist,
	createReferralNote,
};
