import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { statusCodes } from "@/constants";

const prisma = new PrismaClient();

// Include object for user profile queries
const USER_PROFILE_INCLUDE = {
	personalInformation: true,
	contactInformation: true,
	addressInformation: true,
	company: true,
};

// Helper functions
const sendError = (res: Response, status: number, message: string) => {
	return res.status(status).json({ message });
};

const findUserByGoogleId = async (googleId: string) => {
	return prisma.user.findUnique({
		where: { googleId: String(googleId) },
	});
};

const createUserProfile = async (req: Request, res: Response): Promise<any> => {
	try {
		if (!req.body || req.body.length === 0) {
			return sendError(res, statusCodes.badRequest, "Content cannot be empty!");
		}

		const { googleId, firstName, lastName, title, preferredName, dateOfBirth, gender, email, phone, address, suburb, city, postCode, country } = req.body;

		const userExists = await findUserByGoogleId(googleId);
		if (userExists) {
			return sendError(res, statusCodes.badRequest, "User already exists");
		}

		const newUser = await prisma.user.create({
			data: { googleId },
		});

		await prisma.personalInformation.create({
			data: {
				userId: newUser.id,
				firstName,
				lastName,
				title,
				gender,
				preferredName,
				dateOfBirth: new Date(dateOfBirth),
			},
		});

		await prisma.contactInformation.create({
			data: {
				userId: newUser.id,
				email,
				phone,
			},
		});

		await prisma.addressInformation.create({
			data: {
				userId: newUser.id,
				address,
				suburb,
				city,
				postCode,
				country,
			},
		});

		return res.status(statusCodes.created).json({ message: "User profile created successfully" });
	} catch (error: unknown) {
		console.error(error);
		return sendError(res, statusCodes.internalServerError, "Failed to create user profile");
	}
};

const getUserProfile = async (req: Request, res: Response): Promise<any> => {
	try {
		const { googleId } = req.query;

		const user = await prisma.user.findUnique({
			where: { googleId: String(googleId) },
			include: USER_PROFILE_INCLUDE,
		});

		if (!user) {
			return sendError(res, statusCodes.notFound, "User not found");
		}

		return res.status(statusCodes.success).json({ user });
	} catch (error) {
		console.error(error);
		return sendError(res, statusCodes.internalServerError, "Failed to retrieve user profile");
	}
};

export { createUserProfile, getUserProfile };
