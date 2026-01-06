import { PrismaClient, Company } from "@prisma/client";
import { Request, Response } from "express";
import { statusCodes } from "@/constants";

const prisma = new PrismaClient();

type CompanyWithoutTimestamps = Omit<Company, "createdAt" | "updatedAt">;

// Select object for company queries
const COMPANY_SELECT = {
	id: true,
	name: true,
	address: true,
	suburb: true,
	city: true,
	postCode: true,
	country: true,
	phone: true,
	email: true,
	website: true,
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

const createCompany = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			sendError(res, statusCodes.badRequest, "Content cannot be empty!");
			return;
		}

		const { companyName, city, address, suburb, postCode, country, phone, email, website } = req.body;

		const checkCompanyName = await prisma.company.findFirst({
			where: { name: companyName, address },
		});

		if (checkCompanyName) {
			sendError(res, statusCodes.badRequest, "Company with this name and address already exists");
			return;
		}

		const result = await prisma.company.create({
			data: {
				name: companyName,
				address,
				suburb,
				city,
				postCode,
				country,
				phone,
				email,
				website: website ?? null,
			},
		});

		res.status(statusCodes.success).json(result);
	} catch (error) {
		console.error(error);
		sendError(res, statusCodes.internalServerError, error instanceof Error ? error.message : "Unknown error");
	}
};

const getCompanyList = async (req: Request, res: Response): Promise<void> => {
	try {
		const companies: CompanyWithoutTimestamps[] = await prisma.company.findMany({
			select: COMPANY_SELECT,
		});

		res.status(statusCodes.success).json(companies);
	} catch (error) {
		console.error(error);
		sendError(res, statusCodes.internalServerError, error instanceof Error ? error.message : "Unknown error");
	}
};

const joinCompany = async (req: Request, res: Response): Promise<void> => {
	try {
		const { companyId, userId } = req.body;

		if (!companyId || !userId) {
			sendError(res, statusCodes.badRequest, "Company ID and User ID are required");
			return;
		}

		const userExists = await findUserByGoogleId(userId);
		if (!userExists) {
			sendError(res, statusCodes.notFound, "User not found");
			return;
		}

		if (userExists.companyId !== null) {
			sendError(res, statusCodes.badRequest, "User is already part of a company");
			return;
		}

		const company = await prisma.company.findUnique({
			where: { id: String(companyId) },
		});
		if (!company) {
			sendError(res, statusCodes.notFound, "Company not found");
			return;
		}

		const user = await prisma.user.update({
			where: { id: userExists.id },
			data: { companyId: String(companyId) },
		});

		res.status(200).json({
			message: "User added to company successfully",
			user,
		});
	} catch (error) {
		console.error(error);
		sendError(res, statusCodes.internalServerError, error instanceof Error ? error.message : "Unknown error");
	}
};

export { createCompany, getCompanyList, joinCompany };
